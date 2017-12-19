package main

import (
	"github.com/drvirtuozov/ask-a-question/handlers"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"gopkg.in/go-playground/validator.v9"
)

func NewOptionalJWTMiddleware(skipper func(echo.Context) bool) echo.MiddlewareFunc {
	cfg := middleware.DefaultJWTConfig
	cfg.SigningKey = []byte("secret")
	cfg.Skipper = skipper
	return middleware.JWTWithConfig(cfg)
}

var optionalAuth = NewOptionalJWTMiddleware(func(ctx echo.Context) bool {
	var params struct {
		Anon bool `json:"anon" form:"anon" query:"anon"`
	}

	if err := ctx.Bind(&params); err != nil {
		panic(err)
	}

	if err := ctx.Validate(params); err != nil {
		ctx.JSON(400, handlers.NewErrResponse(err))
		return false
	}

	if params.Anon {
		return true
	}

	return false
})

func main() {
	e := echo.New()
	e.Validator = &customValidator{validator: validator.New()}
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	auth := middleware.JWT([]byte("secret"))
	api := e.Group("/api/")
	user := api.Group("user.")
	user.Any("get", handlers.UserGet)
	user.Any("create", handlers.UserCreate)
	token := api.Group("token.")
	token.Any("create", handlers.TokenCreate)
	questions := api.Group("questions.")
	questions.Use(optionalAuth)
	questions.Any("create", handlers.QuestionsCreate)
	questions.Use(auth)
	questions.Any("get", handlers.QuestionsGet)
	questions.Any("delete", handlers.QuestionsDelete)
	questions.Any("restore", handlers.QuestionsRestore)
	answers := api.Group("answers.")
	answers.Any("get", handlers.AnswersGet)
	answers.Use(auth)
	answers.Any("create", handlers.AnswersCreate)
	comments := api.Group("comments.")
	comments.Any("get", handlers.CommentsGet)
	comments.Use(auth)
	comments.Any("create", handlers.CommentsCreate)
	e.Logger.Fatal(e.Start(":3000"))
}
