package main

import (
	"errors"
	"net/http"
)

type UserCreateParams struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

func (ucp *UserCreateParams) Bind(r *http.Request) error {
	if ucp.Username == "" {
		return errors.New("Username is required")
	}

	if ucp.Password == "" {
		return errors.New("Password is required")
	}

	if ucp.Email == "" {
		return errors.New("Email is required")
	}

	return nil
}

type TokenCreateParams struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (tcp *TokenCreateParams) Bind(r *http.Request) error {
	if tcp.Username == "" {
		return errors.New("Username is required")
	}

	if tcp.Password == "" {
		return errors.New("Password is required")
	}

	return nil
}

type QuestionCreateParams struct {
	UserId int    `json:"user_id"`
	Text   string `json:"text"`
}

func (qcp *QuestionCreateParams) Bind(r *http.Request) error {
	if qcp.UserId == 0 {
		return errors.New("User id is required")
	}

	if qcp.Text == "" {
		return errors.New("Text is required")
	}

	return nil
}

type QuestionCreateResult struct {
	Id        uint   `json:"id"`
	Text      string `json:"text"`
	FromId    uint   `json:"from_id,omitempty"`
	Timestamp int64  `json:"timestamp"`
}

func (qcr *QuestionCreateResult) Bind(r *http.Request) error {
	return nil
}
