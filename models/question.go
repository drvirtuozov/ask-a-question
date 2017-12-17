package models

import (
	"time"

	"github.com/drvirtuozov/ask-a-question/db"
	"github.com/drvirtuozov/ask-a-question/shared"
)

type Question struct {
	ID        int    `json:"id"`
	Text      string `json:"text"`
	FromID    *int   `json:"from_id,omitempty"`
	Timestamp int64  `json:"timestamp"`
}

func NewQuestion() *Question {
	return &Question{}
}

func (q *Question) Create(params shared.QuestionCreateParams) error {
	var createdAt time.Time
	err := db.Conn.QueryRow("insert into questions (text, user_id, from_id) values ($1, $2, $3) returning id, text, from_id, created_at",
		params.Text, params.UserID, params.FromID).Scan(&q.ID, &q.Text, &q.FromID, &createdAt)

	if err != nil {
		return err
	}

	q.Timestamp = createdAt.Unix()
	return nil
}
