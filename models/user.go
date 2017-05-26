package models

import (
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	gorm.Model
	Username  string `gorm:"size:50;not null;unique"`
	Password  string `gorm:"not null"`
	Email     string `gorm:"not null;unique"`
	FirstName string `gorm:"not null"`
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
