package main

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username  string     `json:"username" gorm:"unique;not null"`
	Password  string     `json:"password" gorm:"not null"`
	Active    bool       `json:"active" gorm:"default:true"`
	Notebooks []Notebook `json:"notebooks"`
}
