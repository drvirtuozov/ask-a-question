package models

import "github.com/jinzhu/gorm"

type UserAnswer struct {
	gorm.Model
	Text           string `gorm:"not null"`
	UserId         uint
	UserQuestion   UserQuestion
	UserQuestionId uint
	AnswerComments []AnswerComment
	AnswerLikes    []AnswerLike
}
