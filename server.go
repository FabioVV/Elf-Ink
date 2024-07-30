package main

import (
	"net/http"

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

	return c.JSON(http.StatusOK, dbUser)
}

func createNewBook(c echo.Context) error {
	notebook := new(Notebook) // in db.go
	if err := c.Bind(notebook); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Name cannot be blank"})
	}

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

	query := db.Preload("Leafs").Preload("Leafs.Status").Preload("Status").Model(&Notebook{})

	if err := query.Find(&notebooks).Error; err != nil {
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

	e.GET("/api/v1/notebooks", getNotebooks)
	e.POST("/api/v1/notebooks/new", createNewBook)
	e.POST("/api/v1/notebooks/active", setNewActiveNotebook)
	e.GET("/api/v1/notebooks/active/get", getActiveNotebook)
	e.GET("/api/v1/notebooks/active/leafs/get", getActiveNotebookLeafs)

	e.POST("/api/v1/leafs/new", createNewLeaf)
	// e.GET("/api/v1/leafs", getNotebooks)

	e.Logger.Fatal(e.Start(":8080"))
}
