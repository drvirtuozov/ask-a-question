package models

import "github.com/jinzhu/gorm"

type AnswerLike struct {
	gorm.Model
	UserId       uint
	UserAnswerId uint
}
