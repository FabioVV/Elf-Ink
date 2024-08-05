package main

import (
	"context"
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
	ID         uint
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
