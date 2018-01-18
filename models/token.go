package models

import (
	"errors"
)

// Token defines a model for a token
type Token string

// Create signs a user by params and thus creates a new token
func (t *Token) Create(u User) error {
	plainPassword := u.Password

	if err := u.GetByUsername(); err != nil {
		return err
	}

	if !u.CompareHashAndPass(plainPassword) {
		return errors.New("Wrong password")
	}

	token, err := u.Sign()

	if err != nil {
		return err
	}

	*t = *token
	return nil
}
