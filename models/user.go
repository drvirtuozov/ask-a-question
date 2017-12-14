package models

import (
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/drvirtuozov/ask-a-question/db"
	"github.com/drvirtuozov/ask-a-question/shared"
	"golang.org/x/crypto/bcrypt"
)

// User defines a model for a user
type User struct {
	ID        int    `json:"id"`
	Username  string `json:"username"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Email     string `json:"-"`
	Password  string `json:"-"`
}

func (u *User) hashPassword() error {
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(u.Password), 8)

	if err != nil {
		return err
	}

	u.Password = string(hashedPass)
	return nil
}

func (u *User) sign() (token string, err error) {
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       u.ID,
		"username": u.Username,
	})

	return jwtToken.SignedString([]byte("secret"))
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
func (u *User) Create(params shared.UserCreateParams) (token string, err error) {
	u.Username = params.Username
	u.FirstName = params.FirstName
	u.LastName = params.LastName
	u.Email = params.Email
	u.Password = params.Password

	if err := u.hashPassword(); err != nil {
		return token, err
	}

	err = db.Conn.QueryRow("insert into users (username, password, first_name, last_name, email) values ($1, $2, $3, $4, $5) returning id",
		u.Username, u.Password, u.FirstName, u.LastName, u.Email).Scan(&u.ID)

	if err != nil {
		return token, err
	}

	return u.sign()
}
