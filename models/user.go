package models

import (
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	gorm.Model
	Username  string `gorm:"unique" valid:"required,matches(^[a-z]+$)"`
	Password  string `valid:"runelength(8|80),required"`
	Email     string `gorm:"unique" valid:"email,required"`
	FirstName string `valid:"required"`
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
