package models

import (
	"errors"

	"github.com/drvirtuozov/ask-a-question/shared"
)

// Token defines a model for a token
type Token string

// NewToken creates a new token instance
func NewToken() *Token {
	return new(Token)
}

// Create signs a user by params and thus creates a new token
func (t *Token) Create(params shared.TokenCreateParams) error {
	user := NewUser()

	if err := user.GetByUsername(params.Username); err != nil {
		return err
	}

	if !user.CompareHashAndPass(params.Password) {
		return errors.New("Wrong password")
	}

	token, err := user.Sign()

	if err != nil {
		return err
	}

	*t = *token
	return nil
}
