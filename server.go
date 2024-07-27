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

func (a *App) InitializeEcho() {
	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://wails.localhost:34115"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
	}))

	db = InitializeDatabase()

	e.POST("/api/v1/user/login", loginUser)
	e.POST("/api/v1/user/register", registerUser)

	e.Logger.Fatal(e.Start(":8080"))
}
