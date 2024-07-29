package main

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func (u *User) BeforeCreate(tx *gorm.DB) error {
	hashedPassword, err := hashPassword(u.Password)
	if err != nil {
		return err
	}

	u.Password = hashedPassword
	return nil
}

func InitializeDatabase() *gorm.DB {
	var err error

	db, err := gorm.Open(sqlite.Open("elfink.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database: ", err)
	}

	err = db.AutoMigrate(&User{}, &Notebook{}, &Leaf{}, &Status{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	initialStatuses := []Status{
		{Name: "Active"},
		{Name: "Inactive"},
		{Name: "In Progress"},
	}

	for _, status := range initialStatuses {
		db.FirstOrCreate(&status, Status{Name: status.Name})
	}

	return db
}
