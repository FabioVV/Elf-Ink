package main

import (
	"log"

	"golang.org/x/crypto/bcrypt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique;not null"`
	Password string `json:"password" gorm:"not null"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	hashedPassword, err := hashPassword(u.Password)
	if err != nil {
		return err
	}

	u.Password = hashedPassword
	return nil
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPasswordHash(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func InitializeDatabase() *gorm.DB {
	var err error

	db, err := gorm.Open(sqlite.Open("elfink.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database: ", err)
	}

	err = db.AutoMigrate(&User{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}
	return db
}
