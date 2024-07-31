package main

import (
	"bytes"
	"net/http"

	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/yuin/goldmark"
	"golang.org/x/crypto/bcrypt"

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

func requireLogin(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		s, _ := session.Get("session", c)

		if s.Values["username"] == nil {
			return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Unauthorized"})
		}

		return next(c)
	}
}

func userDataHandler(c echo.Context) error {
	s, _ := session.Get("session", c)

	username := s.Values["username"].(string)
	ID := s.Values["ID"].(uint)

	userData := map[string]interface{}{"username": username, "ID": ID}

	return c.JSON(http.StatusOK, userData)
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
		),
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
