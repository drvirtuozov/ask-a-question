package models

import (
	"github.com/drvirtuozov/ask-a-question/db"
)

type Like struct {
	ID       int `json:"-"`
	UserID   int `json:"user_id"`
	AnswerID int `json:"-"`
}

func NewLike() *Like {
	return &Like{}
}

func (l *Like) Create() error {
	_, err := db.Conn.Exec("insert into likes (answer_id, user_id) select $1, $2 where not exists (select id from likes where answer_id = $1 and user_id = $2)",
		l.AnswerID, l.UserID)

	if err != nil {
		return err
	}

	return nil
}

func (l *Like) Delete() error {
	_, err := db.Conn.Exec("delete from likes where answer_id = $1 and user_id = $2",
		l.AnswerID, l.UserID)

	if err != nil {
		return err
	}

	return nil
}
