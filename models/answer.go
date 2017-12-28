package models

import (
	"time"

	"github.com/drvirtuozov/ask-a-question/db"
)

type Answer struct {
	ID           int       `json:"id"`
	Text         string    `json:"text"`
	UserID       int       `json:"-"`
	Question     Question  `json:"question"`
	Timestamp    int64     `json:"timestamp"`
	CommentCount int       `json:"comment_count"`
	Comments     []Comment `json:"comments,omitempty"`
	LikeCount    int       `json:"like_count"`
	Likes        []Like    `json:"likes,omitempty"`
}

func (a *Answer) Create() error {
	var createdAt time.Time

	tx, err := db.Conn.Begin()

	if err != nil {
		return err
	}

	{
		stmt, err := tx.Prepare(`
			insert into answers (text, user_id, question_id) select $1, user_id, id from questions 
			where id = $2 and answer_id is null and user_id = $3 and deleted_at is null returning 
			id, text, user_id, question_id, created_at
		`)

		if err != nil {
			return err
		}

		defer stmt.Close()
		err = stmt.QueryRow(a.Text, a.Question.ID, a.UserID).
			Scan(&a.ID, &a.Text, &a.UserID, &a.Question.ID, &createdAt)

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
		_, err = stmt.Exec(a.ID, a.Question.ID)

		if err != nil {
			tx.Rollback()
			return err
		}
	}

	tx.Commit()
	a.Timestamp = createdAt.Unix()
	return nil
}

func (a *Answer) Get() error {
	var createdAt time.Time
	var qCreatedAt time.Time
	row := db.Conn.QueryRow(`
		select a.id, a.text, a.user_id, q.id as question_id, q.text as question_text, f.id as question_from_id, 
		f.username as question_from_username, q.created_at as question_created_at, a.created_at from answers as a 
		join questions as q on q.id = a.question_id left join users as f on f.id = q.from_id where a.id = $1	
	`, a.ID)

	from := User{}
	err := row.Scan(&a.ID, &a.Text, &a.UserID, &a.Question.ID, &a.Question.Text, &from.ID,
		&from.Username, &qCreatedAt, &createdAt)

	if err != nil {
		return err
	}

	if from.ID != nil {
		a.Question.From = &from
	}

	if err := a.GetComments(); err != nil {
		return err
	}

	if err := a.GetLikes(); err != nil {
		return err
	}

	a.Timestamp = createdAt.Unix()
	a.Question.Timestamp = qCreatedAt.Unix()
	a.LikeCount = len(a.Likes)
	a.CommentCount = len(a.Comments)

	return nil
}

func (a *Answer) GetComments() error {
	rows, err := db.Conn.Query(`
		select c.id, c.text, c.user_id, u.username as user_username, c.answer_id, c.created_at from 
		comments as c join users as u on u.id = c.user_id where c.answer_id = $1 and c.deleted_at is null
	`, a.ID)

	if err != nil {
		return err
	}

	for rows.Next() {
		var c Comment
		var createdAt time.Time
		err := rows.Scan(&c.ID, &c.Text, &c.User.ID, &c.User.Username, &c.AnswerID, &createdAt)

		if err != nil {
			return err
		}

		c.Timestamp = createdAt.Unix()
		a.Comments = append(a.Comments, c)
	}

	return nil
}

func (a *Answer) GetLikes() error {
	rows, err := db.Conn.Query(`
		select l.user_id, u.username from likes as l join users as u on u.id = l.user_id where answer_id = $1
	`, a.ID)

	if err != nil {
		return err
	}

	for rows.Next() {
		var like Like
		rows.Scan(&like.UserID, &like.Username)
		a.Likes = append(a.Likes, like)
	}

	return nil
}
