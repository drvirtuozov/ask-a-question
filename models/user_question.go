package models

import "github.com/jinzhu/gorm"

type UserQuestion struct {
	gorm.Model
	Text    string `gorm:"not null"`
	Deleted bool
	UserId  uint
	FromId  uint
}
