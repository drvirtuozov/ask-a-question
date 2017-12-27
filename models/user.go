package models

import (
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/drvirtuozov/ask-a-question/db"
	"github.com/drvirtuozov/ask-a-question/shared"
	"golang.org/x/crypto/bcrypt"
)

// User defines a model for a user
type User struct {
	ID        *int       `json:"id"`
	Username  *string    `json:"username"`
	FirstName *string    `json:"first_name,omitempty"`
	LastName  *string    `json:"last_name,omitempty"`
	Email     string     `json:"-"`
	Password  string     `json:"-"`
	Questions []Question `json:"-"`
	Answers   []Answer   `json:"-"`
}

// HashPassword hashes instance's plain password
func (u *User) HashPassword() error {
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(u.Password), 8)

	if err != nil {
		return err
	}

	u.Password = string(hashedPass)
	return nil
}

// Sign generates a JWT token by user instance data
func (u *User) Sign() (token *Token, err error) {
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       u.ID,
		"username": u.Username,
	})

	tokenStr, err := jwtToken.SignedString([]byte("secret"))

	if err != nil {
		return token, err
	}

	t := Token(tokenStr)
	return &t, nil
}

// NewUser creates a new user instance
func NewUser() *User {
	return &User{}
}

// GetByUsername fetchs a user and sets it into the instance
func (u *User) GetByUsername(username string) error {
	err := db.Conn.QueryRow(`select id, username, first_name, last_name, password from users where username = $1`, username).
		Scan(&u.ID, &u.Username, &u.FirstName, &u.LastName, &u.Password)

	if err != nil {
		return err
	}

	return nil
}

// Create saves a user into db
func (u *User) Create(params shared.UserCreateParams) (token *Token, err error) {
	u.Username = &params.Username
	u.FirstName = &params.FirstName
	u.LastName = &params.LastName
	u.Email = params.Email
	u.Password = params.Password

	if err := u.HashPassword(); err != nil {
		return token, err
	}

	err = db.Conn.QueryRow("insert into users (username, password, first_name, last_name, email) values ($1, $2, $3, $4, $5) returning id",
		u.Username, u.Password, u.FirstName, u.LastName, u.Email).Scan(&u.ID)

	if err != nil {
		return token, err
	}

	return u.Sign()
}

// CompareHashAndPass compares instance's hashed password and plain one
func (u *User) CompareHashAndPass(password string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password)); err != nil {
		return false
	}

	return true
}

// GetQuestions fetchs user questions by instance's id
func (u *User) GetQuestions() error {
	rows, err := db.Conn.Query(`
		select q.id, q.text, q.user_id, f.id as from_id, f.username as from_username, q.created_at from 
		questions as q left join users as f on f.id = q.from_id where q.user_id = $1 and q.answer_id is null 
		and q.deleted_at is null group by q.id, f.id order by q.id desc`,
		u.ID)

	if err != nil {
		return err
	}

	for rows.Next() {
		var question Question
		var createdAt time.Time
		from := NewUser()
		err := rows.Scan(&question.ID, &question.Text, &question.UserID, &from.ID, &from.Username, &createdAt)

		if err != nil {
			return err
		}

		if from.ID != nil {
			question.From = from
		}

		question.Timestamp = createdAt.Unix()
		u.Questions = append(u.Questions, question)
	}

	return nil
}

func (u *User) GetAnswers() error {
	rows, err := db.Conn.Query(`
		select a.id, a.text, a.user_id, a.created_at, question_id, q.text as question_text, q.from_id as 
		question_from_id, f.username as question_from_username, q.created_at as question_created_at, 
		(select count(id) from likes where answer_id=a.id) as like_count, (select count(id) from comments where answer_id=a.id) 
		as comment_count from answers as a left join questions as q on q.answer_id = a.id left join users as f 
		on f.id = q.from_id where a.user_id = $1 group by a.id, q.id, f.id order by a.id desc`,
		u.ID)

	if err != nil {
		return err
	}

	for rows.Next() {
		var a Answer
		var createdAt time.Time
		var qCreatedAt time.Time
		from := NewUser()
		err := rows.Scan(&a.ID, &a.Text, &a.UserID, &createdAt, &a.Question.ID, &a.Question.Text, &from.ID, &from.Username,
			&qCreatedAt, &a.LikeCount, &a.CommentCount)

		if err != nil {
			return err
		}

		if from.ID != nil {
			a.Question.From = from
		}

		a.Timestamp = createdAt.Unix()
		a.Question.Timestamp = qCreatedAt.Unix()
		a.Question.UserID = a.UserID
		u.Answers = append(u.Answers, a)
	}

	return nil
}
