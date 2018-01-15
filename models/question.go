package models

import (
	"errors"
	"time"

	"github.com/drvirtuozov/ask-a-question/db"
	"github.com/drvirtuozov/ask-a-question/socket"
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
	tx, err := db.Conn.Begin()

	if err != nil {
		return err
	}

	{
		stmt, err := tx.Prepare(`
			insert into questions (text, user_id, from_id) values ($1, $2, $3) returning id, created_at`)

		if err != nil {
			return err
		}

		defer stmt.Close()
		err = stmt.QueryRow(q.Text, q.UserID, q.From.ID).Scan(&q.ID, &createdAt)

		if err != nil {
			tx.Rollback()
			return err
		}
	}

	if q.From.ID != nil {
		stmt, err := tx.Prepare(`
			select username from users where id = $1`)

		if err != nil {
			return err
		}

		defer stmt.Close()
		err = stmt.QueryRow(q.From.ID).Scan(&q.From.Username)

		if err != nil {
			tx.Rollback()
			return err
		}
	} else {
		q.From = nil
	}

	tx.Commit()
	q.Timestamp = createdAt.Unix()
	go q.OnCreate()
	return nil
}

func (q *Question) Delete() error {
	res, err := db.Conn.Exec(`
		update questions set deleted_at = current_timestamp where id = $1 and user_id = $2 and deleted_at is null`,
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

	go q.OnDelete()
	return nil
}

func (q *Question) Restore() error {
	res, err := db.Conn.Exec(`
		update questions set deleted_at = null where id = $1 and user_id = $2 and deleted_at is not null`,
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

	go q.OnRestore()
	return nil
}

func (q *Question) OnCreate() {
	socket.Hub.PersonalBroadcast <- socket.Event{
		Type:    socket.QUESTION_CREATED,
		Payload: q,
		RoomID:  q.UserID,
	}
}

func (q *Question) OnDelete() {
	socket.Hub.PersonalBroadcast <- socket.Event{
		Type:    socket.QUESTION_DELETED,
		Payload: q.ID,
		RoomID:  q.UserID,
	}
}

func (q *Question) OnRestore() {
	socket.Hub.PersonalBroadcast <- socket.Event{
		Type:    socket.QUESTION_RESTORED,
		Payload: q.ID,
		RoomID:  q.UserID,
	}
}
