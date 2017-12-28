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
	user.Any("getAnswers", handlers.UserGetAnswers)
	user.Use(auth)
	user.Any("getQuestions", handlers.UserGetQuestions)
	token := api.Group("token.")
	token.Any("create", handlers.TokenCreate)
	question := api.Group("question.")
	question.Use(optionalAuth)
	question.Any("create", handlers.QuestionCreate)
	question.Use(auth)
	question.Any("delete", handlers.QuestionDelete)
	question.Any("restore", handlers.QuestionRestore)
	answer := api.Group("answer.")
	answer.Any("getComments", handlers.AnswerGetComments)
	answer.Use(auth)
	answer.Any("create", handlers.AnswerCreate)
	comment := api.Group("comment.")
	comment.Use(auth)
	comment.Any("create", handlers.CommentCreate)
	likes := api.Group("likes.")
	likes.Any("get", handlers.LikesGet)
	likes.Use(auth)
	likes.Any("create", handlers.LikesCreate)
	likes.Any("delete", handlers.LikesDelete)
	e.Logger.Fatal(e.Start(":3000"))
}
