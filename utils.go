package main

import (
	"fmt"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

func signUser(id int, username string) (token string, err error) {
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       id,
		"username": username,
	})

	token, err = jwtToken.SignedString([]byte("secret"))

	if err != nil {
		return "", err
	}
	fmt.Println("id", id, "username", username, "token", token)
	return token, nil
}

func hashPassword(password string) (string, error) {
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(password), 8)

	if err != nil {
		return "", err
	}

	return string(hashedPass), nil
}

func compareHashAndPass(hash, password string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		return false
	}

	return true
}
