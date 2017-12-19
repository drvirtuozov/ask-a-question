package models

import (
	"time"

	"github.com/drvirtuozov/ask-a-question/db"
)

type Comment struct {
	ID        int    `json:"id"`
	Text      string `json:"text"`
	UserID    int    `json:"user_id"`
	AnswerID  int    `json:"answer_id"`
	Timestamp int64  `json:"timestamp"`
}

func NewComment() *Comment {
	return &Comment{}
}

func (c *Comment) Create() error {
	var createdAt time.Time

	err := db.Conn.QueryRow("insert into comments (answer_id, user_id, text) values ($1, $2, $3) returning id, text, user_id, created_at",
		c.AnswerID, c.UserID, c.Text).Scan(&c.ID, &c.Text, &c.UserID, &createdAt)

	if err != nil {
		return err
	}

	c.Timestamp = createdAt.Unix()
	return nil
}
