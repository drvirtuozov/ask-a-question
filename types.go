package main

import validator "gopkg.in/go-playground/validator.v9"

type customValidator struct {
	validator *validator.Validate
}

func (cv *customValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}
