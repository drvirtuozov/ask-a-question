package models

import (
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"

	"encoding/json"
	"github.com/dgrijalva/jwt-go"
)

type User struct {
	gorm.Model
	Username  string `gorm:"unique" valid:"required,matches(^[a-z]+$),runelength(5|50)"`
	Password  string `valid:"runelength(8|80),required"`
	Email     string `gorm:"unique" valid:"email,required"`
	FirstName string
	LastName  string
}

func (user *User) BeforeCreate() error {
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(user.Password), 8)

	if err != nil {
		return err
	}

	user.Password = string(hashedPass)
	return nil
}

func (user *User) ComparePassword(password string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return false
	}

	return true
}

func (user *User) Sign() (string, error) {
	rsa := jwt.GetSigningMethod("RSA")
	data, err := json.Marshal(map[string]interface{}{
		"id":       user.ID,
		"username": user.Username,
	})

	if err != nil {
		return "", err
	}

	token, err := rsa.Sign(string(data), "jwtSecret")

	if err != nil {
		return "", err
	}

	return token, nil
}
