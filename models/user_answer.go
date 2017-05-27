package models

import "github.com/jinzhu/gorm"

type UserAnswer struct {
	gorm.Model
	text           string `gorm:"not null"`
	UserId         uint
	UserQuestion   UserQuestion
	UserQuestionId uint
}
