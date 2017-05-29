package models

import "github.com/jinzhu/gorm"

type UserQuestion struct {
	gorm.Model
	Text         string `gorm:"not null"`
	UserId       uint
	FromId       uint `sql:"DEFAULT:NULL"`
	UserAnswerId uint `sql:"DEFAULT:NULL"`
}
