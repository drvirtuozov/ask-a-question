package models

import "github.com/jinzhu/gorm"

type UserQuestion struct {
	gorm.Model
	Text         string `gorm:"not null"`
	UserId       uint
	FromId       uint
	UserAnswerId uint
}