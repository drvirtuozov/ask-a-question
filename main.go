package main

import (
	"github.com/drvirtuozov/ask-a-question/handlers"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"gopkg.in/go-playground/validator.v9"
)

func main() {
	e := echo.New()
	e.Validator = &customValidator{validator: validator.New()}
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	//auth := middleware.JWT([]byte("secret"))
	api := e.Group("/api/")
	user := api.Group("user.")
	user.Any("get", handlers.UserGet)
	e.Logger.Fatal(e.Start(":3000"))
}
