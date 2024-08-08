package main

import "gorm.io/gorm"

type Notebook struct {
	gorm.Model
	Title     string `json:"title" gorm:"not null"`
	StatusID  uint   `json:"status_id" gorm:"not null"`
	Status    Status
	Leafs     []Leaf // One-to-many relationship with Leafs
	LeafCount int    `json:"leaf_count"`
	Active    bool   `json:"active" gorm:"default:false"`

	UserID uint `json:"user_id" gorm:"not null"`
	User   User `json:"user" gorm:"not null"`
}
