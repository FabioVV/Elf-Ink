package main

import (
	"strings"

	"github.com/microcosm-cc/bluemonday"
	"gorm.io/gorm"
)

func (a *App) GetActiveLeaf(token string) interface{} {
	var notebook Notebook

	session, exists := sessionStore.sessions[token]
	if !exists {
		return map[string]string{"error": "Invalid session token"}
	}

	query := db.Where("active = ?", true).Where("user_id = ?", session.ID).Preload("Leafs", "active = ?", true).Preload("Leafs.Status").Limit(1).Find(&notebook)

	if err := query.Error; err != nil {
		return map[string]string{"error": "Error fetching leaf"}
	}

	if len(notebook.Leafs) == 0 {
		return map[string]string{"message": "no active leafs"}
	}

	leaf := notebook.Leafs[0]
	leaf.FormattedCreatedAt = leaf.FormatCreatedAt()
	leaf.FormattedUpdatedAt = leaf.FormatUpdatedAt()

	policy := bluemonday.StrictPolicy()
	cleanBody := policy.Sanitize(leaf.Body)
	marked, err := markdownConverter(cleanBody)

	if err != nil {
		return map[string]string{"message": "Error generating markdown"}
	}

	leaf.MarkedBody = marked

	return leaf
}

func (a *App) SetNewActiveLeaf(token string, leaf_id interface{}) interface{} {
	_, exists := sessionStore.sessions[token]
	if !exists {
		return map[string]string{"error": "Invalid session token"}
	}

	leaf_id = uint(leaf_id.(float64))

	leafDB := new(Leaf)
	if err := db.Where("ID = ?", leaf_id).Preload("Status").First(&leafDB).Error; err != nil {
		return map[string]string{"error": "No active leafs"}
	}

	if err := db.Model(&Leaf{}).Where("active = ?", true).Update("active", false).Error; err != nil {
		return map[string]string{"error": "Falied to deactivate leafs"}
	}

	leafDB.Active = true
	if err := db.Save(leafDB).Error; err != nil {
		return map[string]string{"error": "Falied to activate leaf"}
	}

	policy := bluemonday.StrictPolicy()
	cleanBody := policy.Sanitize(leafDB.Body)
	marked, err := markdownConverter(cleanBody)
	if err != nil {
		return map[string]string{"error": "Error generating markdown"}
	}

	leafDB.MarkedBody = marked
	leafDB.WordCount = GetWordCount(leafDB.MarkedBody) // TODO, return this aswell

	return leafDB
}

func (a *App) CreateNewLeaf(token string, leafObj map[string]interface{}) interface{} {
	leaf := new(Leaf)

	notebook_id := uint(leafObj["notebook_id"].(float64))

	leaf.Title = leafObj["title"].(string)
	leaf.NotebookID = uint(notebook_id)

	if err := db.Create(leaf).Error; err != nil {
		switch err.Error() {
		default:
			return map[string]string{"error": "Error trying to create new leaf"}
		}

	}

	return leaf
}

func (a *App) SetNewStatusLeaf(token string, statusObj map[string]interface{}) interface{} {

	// session, exists := sessionStore.sessions[token]
	// if !exists {
	// 	return map[string]string{"error": "Invalid session token"}
	// }

	name := statusObj["name"].(string)
	ID := uint(statusObj["ID"].(float64))

	status := new(Status)
	if err := db.Where("name = ?", name).First(status).Error; err != nil {
		return map[string]string{"error": "Status not found"}
	}

	leafDB := new(Leaf)
	if err := db.Where("ID = ?", ID).First(leafDB).Preload("Status").Error; err != nil {
		return map[string]string{"error": "Invalid leaf id"}
	}

	leafDB.StatusID = status.ID
	if err := db.Save(leafDB).Error; err != nil {
		return map[string]string{"error": "Failed to change leaf status"}
	}

	return map[string]string{"success": "New leaf status set"}
}

func (a *App) UpdateLeaf(token string, leafBody string, ID uint) interface{} {
	var leaf Leaf

	if err := db.First(&leaf, ID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return map[string]string{"error": "Leaf not found"}

		}
		return map[string]string{"error": "Error fetching leaf"}

	}

	leaf.Body = leafBody
	if err := db.Save(&leaf).Error; err != nil {
		return map[string]string{"error": "Error updating leaf"}

	}

	policy := bluemonday.StrictPolicy()
	cleanBody := policy.Sanitize(leaf.Body)
	marked, err := markdownConverter(cleanBody)

	if err != nil {
		return map[string]string{"error": "Error generating markdown"}
	}

	leaf.MarkedBody = marked
	leaf.WordCount = GetWordCount(leaf.MarkedBody) // TODO, return this aswell

	return leaf.MarkedBody
}

func (a *App) DeleteLeaf(token string, leaf_id uint) interface{} {
	var leaf Leaf

	_, exists := sessionStore.sessions[token]
	if !exists {
		return map[string]string{"error": "Invalid session token"}
	}

	// I know. I should get the user's notebook, find the leaf just the delete it.
	// Since this is a local app and iam kinda just doing it for myself, i will keep like this
	// yikes
	err := db.Where("id = ?", leaf_id).First(&leaf).Error

	if err != nil {
		return map[string]string{"error": err.Error()}
	}

	err = db.Delete(&leaf).Error
	if err != nil {
		return map[string]string{"error": "Error deleting leaf"}
	}

	return map[string]string{"success": "Leaf deleted successfully"}
}

func (a *App) PatchLeafName(token string, leaf_id uint, newName string) interface{} {
	var leaf Leaf

	_, exists := sessionStore.sessions[token]
	if !exists {
		return map[string]string{"error": "Invalid session token"}
	}

	if err := db.First(&leaf, leaf_id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return map[string]string{"error": "Leaf not found"}

		}
		return map[string]string{"error": "Error fetching leaf"}
	}

	if newName == "" || strings.TrimSpace(newName) == "" {
		return map[string]string{"error": "Leaf title cannot be blank"}

	}

	leaf.Title = newName
	if err := db.Save(&leaf).Error; err != nil {
		return map[string]string{"error": "Error updating leaf"}

	}

	return map[string]string{"success": "Leaf title updated"}

}
