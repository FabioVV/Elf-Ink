package main

import (
	"net/http"
	"strconv"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/microcosm-cc/bluemonday"
	"gorm.io/gorm"
)

var db *gorm.DB

func registerUser(c echo.Context) error {

	user := new(User) // in db.go
	if err := c.Bind(user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Username or password are blank"})
	}

	if err := db.Create(user).Error; err != nil {
		switch err.Error() {
		case "UNIQUE constraint failed: users.username":
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Username taken"})
		default:
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error when trying to create account"})
		}

	}

	return c.JSON(http.StatusCreated, user)
}

func loginUser(c echo.Context) error {
	user := new(User) // in db.go
	if err := c.Bind(user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Username or password are blank"})
	}

	dbUser := new(User)
	if err := db.Where("username = ?", user.Username).First(dbUser).Error; err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid username or password"})
	}

	if !CheckPasswordHash(user.Password, dbUser.Password) {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid username or password"})
	}

	s, _ := session.Get("session", c)

	s.Values["username"] = dbUser.Username
	s.Values["ID"] = dbUser.ID

	s.Save(c.Request(), c.Response())

	return c.JSON(http.StatusOK, map[string]string{"message": "Sucessfully logged in"})
}

func createNewNotebook(c echo.Context) error {
	notebook := new(Notebook) // in db.go
	if err := c.Bind(notebook); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Name cannot be blank"})
	}

	s, _ := session.Get("session", c)

	notebook.UserID = s.Values["ID"].(uint)

	if err := db.Create(notebook).Error; err != nil {
		switch err.Error() {
		case "UNIQUE constraint failed: notebooks.title":
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Name already in use"})
		default:
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error when trying to new notebook"})
		}

	}

	return c.JSON(http.StatusCreated, notebook)
}

func setNewActiveNotebook(c echo.Context) error {
	notebook := new(Notebook) // in db.go
	if err := c.Bind(notebook); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "ID is blank or request payload is invalid"})
	}

	notebookDB := new(Notebook)
	if err := db.Where("ID = ?", notebook.ID).First(notebookDB).Error; err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid ID"})
	}

	if err := db.Model(&Notebook{}).Where("active = ?", true).Update("active", false).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to deactivate notebooks"})
	}

	notebookDB.Active = true
	if err := db.Save(notebookDB).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to activate notebook"})
	}

	return c.JSON(http.StatusOK, map[string]string{"success": "Notebook activated"})
}

func setNewActiveLeaf(c echo.Context) error {
	leaf := new(Leaf) // in db.go
	if err := c.Bind(leaf); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "ID is blank or request payload is invalid"})
	}

	leafDB := new(Leaf)
	if err := db.Where("ID = ?", leaf.ID).Preload("Status").First(&leafDB).Error; err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid ID"})
	}

	if err := db.Model(&Leaf{}).Where("active = ?", true).Update("active", false).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to deactivate leafs"})
	}

	leafDB.Active = true
	if err := db.Save(leafDB).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to activate leaf"})
	}

	return c.JSON(http.StatusOK, leafDB)
}

func setNewStatusLeaf(c echo.Context) error {
	var requestData UpdateLeafStatus

	if err := c.Bind(&requestData); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}

	name := requestData.Name
	ID := requestData.ID

	status := new(Status)
	if err := db.Where("name = ?", name).First(status).Error; err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Status not found"})
	}

	leafDB := new(Leaf)
	if err := db.Where("ID = ?", ID).First(leafDB).Preload("Status").Error; err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid leaf ID"})
	}

	leafDB.StatusID = status.ID
	if err := db.Save(leafDB).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to change leaf status"})
	}

	return c.JSON(http.StatusOK, map[string]string{"success": "New leaf status set"})
}

func getNotebooks(c echo.Context) error {
	var notebooks []Notebook

	s, _ := session.Get("session", c)

	ID := s.Values["ID"].(uint)

	if err := db.Preload("Leafs").Preload("Leafs.Status").Where("user_id = ?", ID).Find(&notebooks).Error; err != nil {
		switch err.Error() {
		default:
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error fetching notebooks"})
		}
	}

	for i := range notebooks {
		notebooks[i].LeafCount = len(notebooks[i].Leafs)
	}

	policy := bluemonday.StrictPolicy()
	for i := range notebooks {
		for j := range notebooks[i].Leafs {
			notebooks[i].Leafs[j].FormattedCreatedAt = notebooks[i].Leafs[j].FormatCreatedAt()
			notebooks[i].Leafs[j].FormattedUpdatedAt = notebooks[i].Leafs[j].FormatUpdatedAt()

			cleanBody := policy.Sanitize(notebooks[i].Leafs[j].Body)
			marked, err := markdownConverter(cleanBody)

			if err != nil {
				return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error generating markdown"})
			}

			notebooks[i].Leafs[j].MarkedBody = marked
		}
	}

	return c.JSON(http.StatusOK, notebooks)
}

func getActiveNotebook(c echo.Context) error {
	var notebook Notebook

	s, _ := session.Get("session", c)
	ID := s.Values["ID"].(uint)

	query := db.Where("active = ?", true).Where("user_id = ?", ID)
	query = query.Limit(1).Find(&notebook)

	if err := query.Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error fetching notebooks"})
	}

	notebook.LeafCount = len(notebook.Leafs)

	return c.JSON(http.StatusOK, notebook)
}

func getActiveLeaf(c echo.Context) error {
	var notebook Notebook

	s, _ := session.Get("session", c)
	ID := s.Values["ID"].(uint)

	query := db.Where("active = ?", true).Where("user_id = ?", ID).Preload("Leafs", "active = ?", true).Preload("Leafs.Status").Limit(1).Find(&notebook)

	if err := query.Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error fetching leaf"})
	}

	if len(notebook.Leafs) == 0 {
		return c.JSON(http.StatusOK, map[string]string{"Message": "No active leafs"})
	}

	leaf := notebook.Leafs[0]
	leaf.FormattedCreatedAt = leaf.FormatCreatedAt()
	leaf.FormattedUpdatedAt = leaf.FormatUpdatedAt()

	policy := bluemonday.StrictPolicy()
	cleanBody := policy.Sanitize(leaf.Body)
	marked, err := markdownConverter(cleanBody)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error generating markdown"})
	}

	leaf.MarkedBody = marked

	return c.JSON(http.StatusOK, leaf)
}

func getActiveNotebookLeafs(c echo.Context) error {
	var notebook Notebook

	s, _ := session.Get("session", c)
	ID := s.Values["ID"].(uint)

_:
	strconv.Atoi(c.QueryParam("ID"))
	// if err != nil {
	// 	return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Invalid notebook ID"})
	// }

	title := c.QueryParam("title")

	query := db.Where("Active = ?", true).
		Where("user_id = ?", ID).
		Preload("Leafs", func(db *gorm.DB) *gorm.DB {
			return db.Where("title LIKE ?", "%"+title+"%")
		}).
		Preload("Leafs.Status").
		Find(&notebook)

	if err := query.Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error fetching leafs"})
	}

	notebook.LeafCount = len(notebook.Leafs)
	policy := bluemonday.StrictPolicy()

	for i := range notebook.Leafs {
		notebook.Leafs[i].FormattedCreatedAt = notebook.Leafs[i].FormatCreatedAt()
		notebook.Leafs[i].FormattedUpdatedAt = notebook.Leafs[i].FormatUpdatedAt()

		cleanBody := policy.Sanitize(notebook.Leafs[i].Body)
		marked, err := markdownConverter(cleanBody)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error generating markdown"})
		}

		notebook.Leafs[i].MarkedBody = marked
	}

	return c.JSON(http.StatusOK, notebook.Leafs)
}

func createNewLeaf(c echo.Context) error {
	leaf := new(Leaf) // in db.go
	if err := c.Bind(leaf); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Title cannot be blank"})
	}

	if err := db.Create(leaf).Error; err != nil {
		switch err.Error() {
		default:
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error when trying to new notebook"})
		}

	}

	return c.JSON(http.StatusCreated, leaf)
}

func updateLeaf(c echo.Context) error {
	var leaf Leaf
	var req UpdateLeafRequest
	idStr := c.Param("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid leaf ID",
		})
	}

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Invalid request payload",
		})
	}

	if err := db.First(&leaf, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.JSON(http.StatusNotFound, map[string]string{
				"error": "Leaf not found",
			})
		}
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Error fetching leaf",
		})
	}

	leaf.Body = req.Body
	if err := db.Save(&leaf).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": "Error updating leaf",
		})
	}

	policy := bluemonday.StrictPolicy()
	cleanBody := policy.Sanitize(leaf.Body)
	marked, err := markdownConverter(cleanBody)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error generating markdown"})
	}

	leaf.MarkedBody = marked

	return c.JSON(http.StatusOK, leaf.MarkedBody)
}

func Logout(c echo.Context) error {
	sess, _ := session.Get("session", c)

	sess.Options.MaxAge = -1 // Delete the session

	sess.Save(c.Request(), c.Response())

	return c.JSON(http.StatusOK, map[string]string{"message": "Logged out"})
}

func (a *App) InitializeEcho() {
	e := echo.New()

	store := sessions.NewCookieStore([]byte("secret-key"))
	e.Use(session.Middleware(store))

	sessions.NewSession(store, "session")

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://wails.localhost:34115"},
		AllowMethods:     []string{echo.GET, echo.POST, echo.PATCH, echo.DELETE},
		AllowHeaders:     []string{echo.HeaderContentType, echo.HeaderAuthorization, "X-CSRF-Token"},
		AllowCredentials: true,
	}))

	e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
		TokenLookup:  "cookie:_csrf",
		CookiePath:   "/", // Path for the CSRF cookie
		CookieDomain: "",  // Domain for the CSRF cookie (set if needed)
		// CookieSecure:   true,                 // Secure flag (use true in production)
		CookieHTTPOnly: true,                  // HttpOnly flag (cookie should not be accessible from JavaScript)
		CookieSameSite: http.SameSiteNoneMode, // SameSite policy
	}))

	e.Use(middleware.SecureWithConfig(middleware.SecureConfig{
		ContentSecurityPolicy: "default-src 'self'",
		XSSProtection:         "1; mode=block",
	}))

	db = InitializeDatabase()

	e.POST("/api/v1/user/login", loginUser)
	e.POST("/api/v1/user/register", registerUser)
	e.GET("/api/v1/user/get", userDataHandler, requireLogin)
	e.POST("/api/v1/user/logout", Logout, requireLogin)

	e.GET("/api/v1/notebooks", getNotebooks, requireLogin)
	e.POST("/api/v1/notebooks/new", createNewNotebook, requireLogin)
	e.POST("/api/v1/notebooks/active", setNewActiveNotebook, requireLogin)
	e.GET("/api/v1/notebooks/active/get", getActiveNotebook, requireLogin)
	e.GET("/api/v1/notebooks/active/leafs/get", getActiveNotebookLeafs, requireLogin)

	e.POST("/api/v1/leafs/new", createNewLeaf, requireLogin)
	e.PATCH("/api/v1/leafs/:id", updateLeaf, requireLogin)
	e.POST("/api/v1/leafs/active", setNewActiveLeaf, requireLogin)
	e.GET("/api/v1/leafs/active/get", getActiveLeaf, requireLogin)
	e.POST("/api/v1/leafs/status", setNewStatusLeaf, requireLogin)

	e.GET("/api/v1/csrf", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"csrf_token": "Set"})
	})

	e.Logger.Fatal(e.Start(":8080"))
}
