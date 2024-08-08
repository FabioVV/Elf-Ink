package main

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"strings"

	"github.com/yuin/goldmark"
	"golang.org/x/crypto/bcrypt"

	chromahtml "github.com/alecthomas/chroma/v2/formatters/html"
	highlighting "github.com/yuin/goldmark-highlighting/v2"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPasswordHash(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func (l *Leaf) FormatCreatedAt() string {
	return l.CreatedAt.Format("Jan 2, 2006 at 3:04pm")

}

func (l *Leaf) FormatUpdatedAt() string {
	return l.UpdatedAt.Format("Jan 2, 2006 at 3:04pm")
}

// func requireLogin(next echo.HandlerFunc) echo.HandlerFunc {
// 	return func(c echo.Context) error {
// 		s, _ := session.Get("session", c)

// 		if s.Values["username"] == nil {
// 			return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
// 		}

// 		return next(c)
// 	}
// }

// func userDataHandler(c echo.Context) error {
// 	s, _ := session.Get("session", c)

// 	username := s.Values["username"].(string)
// 	ID := s.Values["ID"].(uint)

// 	userData := map[string]interface{}{"username": username, "ID": ID}

// 	return c.JSON(http.StatusOK, userData)
// }

func GenerateToken() (string, error) {
	bytes := make([]byte, 16)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func markdownConverter(text string) (string, error) {
	var buf bytes.Buffer

	md := goldmark.New(
		goldmark.WithExtensions(
			extension.Typographer,
			extension.DefinitionList,
			extension.Footnote,
			extension.Strikethrough,
			extension.GFM,
			extension.TaskList,
			extension.Linkify,
			extension.Table,
			highlighting.NewHighlighting(
				highlighting.WithStyle("monokai"),
				highlighting.WithFormatOptions(
					chromahtml.WithLineNumbers(true),
				),
			)),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithHardWraps(),
		),
	)

	if err := md.Convert([]byte(text), &buf); err != nil {
		return "", err
	}
	return buf.String(), nil
}

func GetWordCount(text string) uint {
	words_array := strings.Split(text, " ")
	word_count := len(words_array)

	return uint(word_count)
}
