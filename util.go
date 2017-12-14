package main

import (
	"golang.org/x/crypto/bcrypt"
)

func compareHashAndPass(hash, password string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		return false
	}

	return true
}
