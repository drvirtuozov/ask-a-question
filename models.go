package main

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

type AnswerComment struct {
	gorm.Model
	Text         string `gorm:"not null"`
	UserId       uint
	UserAnswerId uint
}

type AnswerLike struct {
	gorm.Model
	UserId       uint
	UserAnswerId uint
}

type User struct {
	gorm.Model
	Username      string `gorm:"unique" valid:"required,matches(^[a-z]+$),runelength(5|50)" json:"username"`
	Password      string `valid:"runelength(8|80),required" json:"password"`
	Email         string `gorm:"unique" valid:"email,required" json:"email"`
	FirstName     string `json:"first_name,omitempty"`
	LastName      string `json:"last_name,omitempty"`
	UserQuestions []UserQuestion
	UserAnswers   []UserAnswer
}

func (user *User) BeforeCreate() error {
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(user.Password), 8)

	if err != nil {
		return err
	}

	user.Password = string(hashedPass)
	return nil
}

func (user *User) ComparePassword(password string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return false
	}

	return true
}

func (user *User) Sign() (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       user.ID,
		"username": user.Username,
	})

	tokenString, err := token.SignedString([]byte("secret"))

	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (user *User) AfterCreate(db *gorm.DB) {
	/*db.Model(user).Association("UserQuestions").Append([]*UserQuestion{
		&UserQuestion{
			Text:   "First random question from admin",
			FromId: 1,
		},
		&UserQuestion{
			Text:   "Second random question from admin",
			FromId: 1,
		},
		&UserQuestion{
			Text:   "Third random question from admin",
			FromId: 1,
		},
	})*/
}

type UserAnswer struct {
	gorm.Model
	Text           string `gorm:"not null"`
	UserId         uint
	UserQuestion   UserQuestion
	UserQuestionId uint
	AnswerComments []AnswerComment
	AnswerLikes    []AnswerLike
}

type UserQuestion struct {
	gorm.Model
	Text         string `gorm:"not null"`
	UserId       uint
	FromId       uint `sql:"DEFAULT:NULL"`
	UserAnswerId uint `sql:"DEFAULT:NULL"`
}
