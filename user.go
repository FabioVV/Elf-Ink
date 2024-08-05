package main

import (
	"time"
)

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
	defer sessionStore.Unlock()
	sessionStore.sessions[token] = Session{
		ID:         dbUser.ID,
		Username:   dbUser.Username,
		ExpiryTime: time.Now().Add(TokenValidity),
	}

	return map[string]string{"token": token, "username": dbUser.Username}
}

func (a *App) LogoutUser(token string) map[string]string {
	sessionStore.Lock()
	defer sessionStore.Unlock()

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
