package main

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique;not null"`
	Password string `json:"password" gorm:"not null"`
	Active   bool   `json:"active" gorm:"default:true"`
}

type Notebook struct {
	gorm.Model
	Title     string `json:"title" gorm:"unique;not null"`
	StatusID  uint   `json:"status_id" gorm:"not null"`
	Status    Status
	Leafs     []Leaf // One-to-many relationship with Leafs
	LeafCount int    `json:"leaf_count"`
}

type Leaf struct {
	gorm.Model
	Title      string `json:"title" gorm:"not null"`
	Body       string `json:"body" gorm:"not null"`
	NotebookID uint   `json:"notebook_id" gorm:"not null"`
	Notebook   Notebook
	StatusID   uint `json:"status" gorm:"not null"`
	Status     Status
}

type Status struct {
	gorm.Model
	Name      string     `json:"name" gorm:"unique;not null"`
	Notebooks []Notebook // One-to-many relationship with Notebooks
	Leafs     []Leaf     // One-to-many relationship with Leafs
}
