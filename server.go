package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func test(c echo.Context) error {
	return c.HTML(http.StatusOK, "<h1>Hello, World!</h1>")
}

func (a *App) InitializeEcho() {
	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://wails.localhost:34115"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
	}))

	e.POST("/api/v1/login", test)
	e.POST("/api/v1/register", test)

	e.Logger.Fatal(e.Start(":8080"))
}
