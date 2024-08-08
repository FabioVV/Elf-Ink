package main

import (
	"gorm.io/gorm"
)

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
	WordCount          uint   `json:"word_count"`

	Status Status
}

type UpdateLeafRequest struct {
	Body string `json:"body"`
}

type UpdateLeafStatus struct {
	Name string `json:"name"`
	ID   int    `json:"ID"`
}
