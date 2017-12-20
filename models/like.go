package models

type Like struct {
	ID       int `json:"-"`
	UserID   int `json:"user_id"`
	AnswerID int `json:"-"`
}
