package models

import (
	"errors"
	"time"

	"github.com/drvirtuozov/ask-a-question/db"
)

type Question struct {
	ID        *int   `json:"id"`
	Text      string `json:"text"`
	UserID    int    `json:"-"`
	From      *User  `json:"from,omitempty"`
	Timestamp int64  `json:"timestamp"`
}

func (q *Question) Create() error {
	var createdAt time.Time
	err := db.Conn.QueryRow("insert into questions (text, user_id, from_id) values ($1, $2, $3) returning id, text, user_id, from_id, created_at",
		q.Text, q.UserID, q.From.ID).Scan(&q.ID, &q.Text, &q.UserID, &q.From.ID, &createdAt)

	if err != nil {
		return err
	}

	if q.From.ID == nil {
		q.From = nil
	}

	q.Timestamp = createdAt.Unix()
	return nil
}

func (q *Question) Delete() error {
	res, err := db.Conn.Exec("update questions set deleted_at = current_timestamp where id = $1 and user_id = $2 and deleted_at is null",
		q.ID, q.UserID)

	if err != nil {
		return err
	}

	rowsCount, err := res.RowsAffected()

	if err != nil {
		return err
	}

	if rowsCount == 0 {
		return errors.New("Question not found")
	}

	return nil
}

func (q *Question) Restore() error {
	res, err := db.Conn.Exec("update questions set deleted_at = null where id = $1 and user_id = $2 and deleted_at is not null",
		q.ID, q.UserID)

	if err != nil {
		return err
	}

	rowsCount, err := res.RowsAffected()

	if err != nil {
		return err
	}

	if rowsCount == 0 {
		return errors.New("Question not found")
	}

	return nil
}
