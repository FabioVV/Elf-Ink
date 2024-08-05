package main

import (
	"context"
	"fmt"
	"sync"
	"time"

	"gorm.io/gorm"
)

var db *gorm.DB = InitializeDatabase()
var sessionStore = struct {
	sync.RWMutex
	sessions map[string]Session
}{sessions: make(map[string]Session)}

const TokenValidity = 24444 * time.Hour

type Session struct {
	Username   string
	ExpiryTime time.Time
}

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
		return map[string]string{"error": "Username and password cannot be blank"}
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

func (a *App) LoginUser(userObj map[string]string) map[string]string {

	user := new(User)
	user.Username = userObj["username"]
	user.Password = userObj["password"]

	dbUser := new(User)
	if err := db.Where("username = ?", user.Username).First(dbUser).Error; err != nil {
		return map[string]string{"error": "Invalid username or password"}
	}

	if !CheckPasswordHash(user.Password, dbUser.Password) {
		return map[string]string{"error": "Invalid username or password"}
	}

	token, err := GenerateToken()
	if err != nil {
		return map[string]string{"error": "Error when generating token"}
	}

	sessionStore.Lock()
	sessionStore.sessions[token] = Session{
		Username:   dbUser.Username,
		ExpiryTime: time.Now().Add(TokenValidity),
	}
	sessionStore.Unlock()

	return map[string]string{"message": "Succesfully logged in"}
}

func (a *App) LogoutUser(token string) map[string]string {
	sessionStore.Lock()
	defer sessionStore.Unlock()

	if _, exists := sessionStore.sessions[token]; !exists {
		return map[string]string{"error": "Error logging out"}
	}

	delete(sessionStore.sessions, token)

	return map[string]string{"success": "User logged out"}
}

func (a *App) ValidateSession(token string) map[string]string {
	sessionStore.RLock()
	defer sessionStore.RUnlock()

	session, exists := sessionStore.sessions[token]
	if !exists {
		return map[string]string{"error": "Invalid session token"}
	}

	if session.ExpiryTime.Before(time.Now()) {
		return map[string]string{"error": "Session token expired"}
	}

	return map[string]string{"username": session.Username}
}
