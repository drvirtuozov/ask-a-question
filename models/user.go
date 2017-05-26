package models

import (
	"github.com/jinzhu/gorm"
	//"golang.org/x/crypto/bcrypt"
)


type User struct {
	gorm.Model
	Username  string `gorm:"size:50;not null;unique"`
	Password  string `gorm:"not null"`
	Email     string `gorm:"not null;unique"`
	FirstName string `gorm:"not null"`
	LastName  string
}

