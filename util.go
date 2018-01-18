package main

import (
	"bytes"
	"io/ioutil"

	"github.com/drvirtuozov/ask-a-question/handlers"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	validator "gopkg.in/go-playground/validator.v9"
)

type customValidator struct {
	validator *validator.Validate
}

func (cv *customValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

func NewOptionalJWTMiddleware(skipper func(echo.Context) bool) echo.MiddlewareFunc {
	cfg := middleware.DefaultJWTConfig
	cfg.SigningKey = []byte("secret")
	cfg.Skipper = skipper
	return middleware.JWTWithConfig(cfg)
}

var optionalAuth = NewOptionalJWTMiddleware(func(ctx echo.Context) bool {
	var bodyBytes []byte
	var params struct {
		Anon bool `json:"anon" form:"anon" query:"anon"`
	}

	if ctx.Request().Body != nil {
		bodyBytes, _ = ioutil.ReadAll(ctx.Request().Body)
	}

	ctx.Request().Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))

	if err := ctx.Bind(&params); err != nil {
		panic(err)
	}

	ctx.Request().Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))

	if err := ctx.Validate(params); err != nil {
		ctx.JSON(400, handlers.NewErrResponse(err))
		return false
	}

	if params.Anon {
		return true
	}

	return false
})
