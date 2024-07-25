package main

import (
	"context"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// App struct
type App struct {
	ctx context.Context
	db  *gorm.DB
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) InitializeDatabase() {
	var err error

	a.db, err = gorm.Open(sqlite.Open("elfink.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database: ", err)
	}

	err = a.db.AutoMigrate()
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

}

func (a *App) InitializeEcho() {
	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://wails.localhost:34115"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
	}))

	e.POST("/api/v1/test", test)

	e.Logger.Fatal(e.Start(":8080"))
}

func test(c echo.Context) error {
	return c.HTML(http.StatusOK, "<h1>Hello, World!</h1>")
}
