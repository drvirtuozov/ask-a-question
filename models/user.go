package models

import "github.com/drvirtuozov/ask-a-question/db"

// User defines a model for a user
type User struct {
	ID        int    `json:"id"`
	Username  string `json:"username"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Password  string `json:"-"`
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
