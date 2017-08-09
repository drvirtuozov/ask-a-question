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
