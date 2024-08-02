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

type Leaf struct {
	gorm.Model
	Title      string `json:"title" gorm:"not null"`
	Body       string `json:"body"`
	MarkedBody string `json:"marked_body"`
	NotebookID uint   `json:"notebook_id" gorm:"not null"`
	StatusID   uint   `json:"status" gorm:"not null"`
	Active     bool   `json:"active" gorm:"default:false"`

	FormattedCreatedAt string `json:"created_at_human"`
	FormattedUpdatedAt string `json:"updated_at_human"`

	Status Status
}

type UpdateLeafRequest struct {
	Body string `json:"body"`
}

type UpdateLeafStatus struct {
	Name string `json:"name"`
	ID   int    `json:"ID"`
}

type Status struct {
	gorm.Model
	Name      string     `json:"name" gorm:"unique;not null"`
	Notebooks []Notebook // One-to-many relationship with Notebooks
	Leafs     []Leaf     // One-to-many relationship with Leafs
}
