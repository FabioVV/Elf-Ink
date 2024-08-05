package main

import (
	"github.com/microcosm-cc/bluemonday"
	"gorm.io/gorm"
)

func (a *App) GetNotebooks(token string) interface{} {
	var notebooks []Notebook

	session, exists := sessionStore.sessions[token]
	if !exists {
		return map[string]string{"error": "Invalid session token"}
	}

	if err := db.Preload("Leafs").Preload("Leafs.Status").Where("user_id = ?", session.ID).Find(&notebooks).Error; err != nil {
		switch err.Error() {
		default:
			return map[string]string{"error": "Error fetching notebooks"}
		}
	}

	for i := range notebooks {
		notebooks[i].LeafCount = len(notebooks[i].Leafs)
	}

	policy := bluemonday.StrictPolicy()
	for i := range notebooks {
		for j := range notebooks[i].Leafs {
			notebooks[i].Leafs[j].FormattedCreatedAt = notebooks[i].Leafs[j].FormatCreatedAt()
			notebooks[i].Leafs[j].FormattedUpdatedAt = notebooks[i].Leafs[j].FormatUpdatedAt()

			cleanBody := policy.Sanitize(notebooks[i].Leafs[j].Body)
			marked, err := markdownConverter(cleanBody)

			if err != nil {
				return map[string]string{"error": "Error generating markdown"}
			}

			notebooks[i].Leafs[j].MarkedBody = marked
		}
	}

	return notebooks
}

func (a *App) GetActiveNotebookLeafs(token string, title string) interface{} {
	var notebook Notebook

	session, exists := sessionStore.sessions[token]
	if !exists {
		return map[string]string{"error": "Invalid session token"}
	}

	query := db.Where("Active = ?", true).
		Where("user_id = ?", session.ID).
		Preload("Leafs", func(db *gorm.DB) *gorm.DB {
			return db.Where("title LIKE ?", "%"+title+"%")
		}).
		Preload("Leafs.Status").
		Find(&notebook)

	if err := query.Error; err != nil {
		return map[string]string{"error": "Error fetching leafs"}
	}

	notebook.LeafCount = len(notebook.Leafs)
	policy := bluemonday.StrictPolicy()

	for i := range notebook.Leafs {
		notebook.Leafs[i].FormattedCreatedAt = notebook.Leafs[i].FormatCreatedAt()
		notebook.Leafs[i].FormattedUpdatedAt = notebook.Leafs[i].FormatUpdatedAt()

		cleanBody := policy.Sanitize(notebook.Leafs[i].Body)
		marked, err := markdownConverter(cleanBody)

		if err != nil {
			return map[string]string{"error": "Error generating markdown"}
		}

		notebook.Leafs[i].MarkedBody = marked
	}

	return notebook.Leafs
}

func (a *App) GetActiveNotebook(token string) interface{} {
	var notebook Notebook

	session, exists := sessionStore.sessions[token]
	if !exists {
		return map[string]string{"error": "Invalid session token"}
	}

	query := db.Where("active = ?", true).Where("user_id = ?", session.ID)
	query = query.Limit(1).Find(&notebook)

	if err := query.Error; err != nil {
		return map[string]string{"error": "Error fetching notebooks"}
	}

	notebook.LeafCount = len(notebook.Leafs)

	return notebook
}

func (a *App) SetNewActiveNotebook(token string, notebook_id uint) interface{} {

	session, exists := sessionStore.sessions[token]
	if !exists {
		return map[string]string{"error": "Invalid session token"}
	}

	notebookDB := new(Notebook)
	if err := db.Where("ID = ?", notebook_id).Where("user_id = ?", session.ID).First(notebookDB).Error; err != nil {
		return map[string]string{"error": "Invalid notebook ID"}
	}

	if err := db.Model(&Notebook{}).Where("active = ?", true).Update("active", false).Error; err != nil {
		return map[string]string{"error": "Failed to deactivate other notebooks"}
	}

	notebookDB.Active = true
	if err := db.Save(notebookDB).Error; err != nil {
		return map[string]string{"error": "Failed to activate notebook"}
	}

	return map[string]string{"success": "Notebook activated"}
}

func (a *App) CreateNewNotebook(token string, notebookObj map[string]string) interface{} {
	notebook := new(Notebook)

	session, exists := sessionStore.sessions[token]
	if !exists {
		return map[string]string{"error": "Invalid session token"}
	}

	notebook.UserID = session.ID
	notebook.Title = notebookObj["title"]

	if err := db.Create(notebook).Error; err != nil {
		switch err.Error() {
		case "UNIQUE constraint failed: notebooks.title":
			return map[string]string{"error": "Name already in use"}
		default:
			return map[string]string{"error": "Error when trying to create new notebook"}
		}

	}

	return notebook
}
