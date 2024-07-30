package main

import "golang.org/x/crypto/bcrypt"

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
