package models

import (
	"time"

	"github.com/drvirtuozov/ask-a-question/db"
)

type Answer struct {
	ID         int    `json:"id"`
	Text       string `json:"text"`
	UserID     int    `json:"user_id"`
	QuestionID int    `json:"question_id"`
	Timestamp  int64  `json:"timestamp"`
	Comments   []Comment
	// Likes      LikesResult `json:"likes"`
}

func NewAnswer() *Answer {
	return &Answer{}
}

func (a *Answer) Create() error {
	var createdAt time.Time

	tx, err := db.Conn.Begin()

	if err != nil {
		return err
	}

	{
		stmt, err := tx.Prepare("insert into answers (text, user_id, question_id) select $1, user_id, id from questions where id = $2 and answer_id is null and user_id = $3 and deleted_at is null returning id, text, user_id, question_id, created_at")

		if err != nil {
			return err
		}

		defer stmt.Close()
		err = stmt.QueryRow(a.Text, a.QuestionID, a.UserID).
			Scan(&a.ID, &a.Text, &a.UserID, &a.QuestionID, &createdAt)

		if err != nil {
			tx.Rollback()
			return err
		}
	}

	{
		stmt, err := tx.Prepare("update questions set answer_id = $1 where id = $2")

		if err != nil {
			return err
		}

		defer stmt.Close()
		_, err = stmt.Exec(a.ID, a.QuestionID)

		if err != nil {
			tx.Rollback()
			return err
		}
	}

	tx.Commit()
	a.Timestamp = createdAt.Unix()
	return nil
}

func (a *Answer) GetComments() error {
	rows, err := db.Conn.Query("select id, text, user_id, created_at from comments where answer_id = $1", a.ID)

	if err != nil {
		return err
	}

	for rows.Next() {
		var c Comment
		var createdAt time.Time
		err := rows.Scan(&c.ID, &c.Text, &c.UserID, &createdAt)

		if err != nil {
			return err
		}

		c.Timestamp = createdAt.Unix()
		a.Comments = append(a.Comments, c)
	}

	return nil
}
