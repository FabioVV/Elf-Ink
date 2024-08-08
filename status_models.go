package main

import (
	"gorm.io/gorm"
)

type Status struct {
	gorm.Model
	Name      string     `json:"name" gorm:"unique;not null"`
	Notebooks []Notebook // One-to-many relationship with Notebooks
	Leafs     []Leaf     // One-to-many relationship with Leafs
}
