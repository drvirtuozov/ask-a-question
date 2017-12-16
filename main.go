package main

import (
	"github.com/drvirtuozov/ask-a-question/handlers"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"gopkg.in/go-playground/validator.v9"
)

func NewOptionalJWTMiddleware() echo.MiddlewareFunc {
	cfg := middleware.DefaultJWTConfig
	cfg.SigningKey = []byte("secret")
	cfg.Skipper = func(ctx echo.Context) bool {
		var params struct {
			Anon bool `json:"anon" form:"anon" query:"anon"`
		}

		if err := ctx.Bind(&params); err != nil {
			panic(err)
		}

		if params.Anon {
			return true
		}

		return false
	}

	return middleware.JWTWithConfig(cfg)
}

func main() {
	e := echo.New()
	e.Validator = &customValidator{validator: validator.New()}
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	//auth := middleware.JWT([]byte("secret"))
	optionalAuth := NewOptionalJWTMiddleware()
	api := e.Group("/api/")
	user := api.Group("user.")
	user.Any("get", handlers.UserGet)
	user.Any("create", handlers.UserCreate)
	token := api.Group("token.")
	token.Any("create", handlers.TokenCreate)
	questions := api.Group("questions.")
	questions.Use(optionalAuth)
	questions.Any("create", handlers.QuestionsCreate)
	e.Logger.Fatal(e.Start(":3000"))
}
