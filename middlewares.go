package main

import (
	"github.com/auth0/go-jwt-middleware"
	"github.com/dgrijalva/jwt-go"
)

func JWTMiddleware() *jwtmiddleware.JWTMiddleware {
	return jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			return []byte("secret"), nil
		},
		SigningMethod:       jwt.SigningMethodHS256,
		CredentialsOptional: true,
	})
}
