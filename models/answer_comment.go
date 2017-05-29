package models

import "github.com/jinzhu/gorm"

type AnswerComment struct {
	gorm.Model
	Text         string `gorm:"not null"`
	UserAnswerId uint
}
