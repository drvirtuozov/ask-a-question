package main

import (
	"log"
	"os"

	"github.com/drvirtuozov/ask-a-question/db"
	"github.com/drvirtuozov/ask-a-question/handlers"
	"github.com/drvirtuozov/ask-a-question/socket"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"gopkg.in/go-playground/validator.v9"
)

var port string

func init() {
	port = os.Getenv("PORT")

	if port == "" {
		log.Fatal("$PORT must be set")
	}

	db.Init()
	db.Migrate()
}

func main() {
	e := echo.New()
	e.Validator = &customValidator{validator: validator.New()}
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.File("*", "index.html")
	e.Static("/dist", "dist")
	e.Any("/ws", socket.Handle)
	go socket.Hub.Run()
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
	answer.Any("get", handlers.AnswerGet)
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
	e.Logger.Fatal(e.Start(":" + port))
}
