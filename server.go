package main

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
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

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": dbUser.Username,
		"ID":       dbUser.ID,
		"exp":      time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"user":  dbUser,
		"token": tokenString,
	})
}

func createNewNotebook(c echo.Context) error {
	notebook := new(Notebook) // in db.go
	if err := c.Bind(notebook); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Name cannot be blank"})
	}

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID, ok := claims["ID"].(float64)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token claims"})
	}
	ID := uint(userID)

	notebook.UserID = ID

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

func getNotebooks(c echo.Context) error {
	var notebooks []Notebook

	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID, ok := claims["ID"].(float64)
	if !ok {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token claims"})
	}
	ID := uint(userID)

	if err := db.Preload("Leafs").Preload("Leafs.Status").Where("user_id = ?", ID).Find(&notebooks).Error; err != nil {
		switch err.Error() {
		default:
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error fetching notebooks"})
		}
	}

	for i := range notebooks {
		notebooks[i].LeafCount = len(notebooks[i].Leafs)
	}

	for i := range notebooks {
		for j := range notebooks[i].Leafs {
			notebooks[i].Leafs[j].FormattedCreatedAt = notebooks[i].Leafs[j].FormatCreatedAt()
			notebooks[i].Leafs[j].FormattedUpdatedAt = notebooks[i].Leafs[j].FormatUpdatedAt()
		}
	}

	return c.JSON(http.StatusOK, notebooks)
}

func getActiveNotebook(c echo.Context) error {
	var notebook Notebook

	query := db.Where("active = ?", true).Preload("Leafs").Preload("Leafs.Status").Limit(1).Find(&notebook)

	if err := query.Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error fetching notebooks"})
	}

	notebook.LeafCount = len(notebook.Leafs)

	for i := range notebook.Leafs {
		notebook.Leafs[i].FormattedCreatedAt = notebook.Leafs[i].FormatCreatedAt()
		notebook.Leafs[i].FormattedUpdatedAt = notebook.Leafs[i].FormatUpdatedAt()
	}

	return c.JSON(http.StatusOK, notebook)
}

func getActiveNotebookLeafs(c echo.Context) error {
	var notebook Notebook

	query := db.Where("active = ?", true).Preload("Leafs").Limit(1).Find(&notebook)

	if err := query.Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error fetching notebooks"})
	}

	notebook.LeafCount = len(notebook.Leafs)

	return c.JSON(http.StatusOK, notebook)
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

// func getNotebooks(c echo.Context) error {
// 	var notebooks []Notebook

// 	// Extract query parameters
// 	title := c.QueryParam("title")
// 	statusID := c.QueryParam("status_id")

// 	// Build the query
// 	query := db.Model(&Notebook{})

// 	if title != "" {
// 		query = query.Where("title LIKE ?", "%"+title+"%")
// 	}

// 	if statusID != "" {
// 		// Convert statusID to uint
// 		statusIDUint, err := strconv.Atoi(statusID)
// 		if err != nil {
// 			return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid status_id"})
// 		}
// 		query = query.Where("status_id = ?", statusIDUint)
// 	}

// 	// Execute the query
// 	result := query.Find(&notebooks)

// 	// Check for errors
// 	if result.Error != nil {
// 		return c.JSON(http.StatusInternalServerError, map[string]string{"error": result.Error.Error()})
// 	}

// 	// Return the notebooks as JSON
// 	return c.JSON(http.StatusOK, notebooks)
// }

func (a *App) InitializeEcho() {
	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://wails.localhost:34115"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
	}))

	db = InitializeDatabase()

	e.POST("/api/v1/user/login", loginUser)
	e.POST("/api/v1/user/register", registerUser)

	e.GET("/api/v1/notebooks", getNotebooks, JWTMiddleWare())
	e.POST("/api/v1/notebooks/new", createNewNotebook, JWTMiddleWare())
	e.POST("/api/v1/notebooks/active", setNewActiveNotebook, JWTMiddleWare())
	e.GET("/api/v1/notebooks/active/get", getActiveNotebook, JWTMiddleWare())
	e.GET("/api/v1/notebooks/active/leafs/get", getActiveNotebookLeafs, JWTMiddleWare())

	e.POST("/api/v1/leafs/new", createNewLeaf, JWTMiddleWare())

	e.Logger.Fatal(e.Start(":8080"))
}
