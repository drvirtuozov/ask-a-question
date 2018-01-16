package models

import (
	"time"

	"github.com/drvirtuozov/ask-a-question/socket"

	"github.com/drvirtuozov/ask-a-question/db"
)

type Comment struct {
	ID        int    `json:"id"`
	Text      string `json:"text"`
	From      User   `json:"from"`
	UserID    int    `json:"-"`
	AnswerID  int    `json:"answer_id"`
	Timestamp int64  `json:"timestamp"`
}

func (c *Comment) Create() error {
	var createdAt time.Time

	err := db.Conn.QueryRow(`
		insert into comments (user_id, answer_id, from_id, text) select user_id, $1, $2, $3 from answers where id = $1
		returning id, user_id, answer_id, text, created_at`,
		c.AnswerID, c.From.ID, c.Text).Scan(&c.ID, &c.UserID, &c.AnswerID, &c.Text, &createdAt)

	if err != nil {
		return err
	}

	c.Timestamp = createdAt.Unix()
	go c.OnCreate()
	return nil
}

func (c *Comment) OnCreate() {
	socket.Hub.Broadcast <- socket.Event{
		Type:    socket.COMMENT_CREATED,
		Payload: c,
		RoomID:  c.UserID,
	}
}
