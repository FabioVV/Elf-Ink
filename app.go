package main

import (
	"context"
	"fmt"

	"gorm.io/gorm"
)

var db *gorm.DB = InitializeDatabase()

// App struct
type App struct {
	ctx context.Context
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

func (a *App) BeforeClose(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Shutdown(ctx context.Context) {
}

func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s!", name)
}

func (a *App) RegisterUser(userObj map[string]string) interface{} {

	user := new(User)
	user.Username = userObj["username"]
	user.Password = userObj["password"]

	if user.Username == "" || user.Password == "" {
		return map[string]string{"error": "Username or password cannot be blank"}
	}

	if err := db.Create(user).Error; err != nil {
		switch err.Error() {
		case "UNIQUE constraint failed: users.username":
			return map[string]string{"error": "Username taken"}
		default:
			return map[string]string{"error": "Error when trying to create account"}
		}

	}

	return map[string]interface{}{
		"user": user,
	}
}
