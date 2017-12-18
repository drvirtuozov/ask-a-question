package handlers

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/drvirtuozov/ask-a-question/models"

	"github.com/drvirtuozov/ask-a-question/shared"
	"github.com/labstack/echo"
)

func AnswersCreate(ctx echo.Context) error {
	var params shared.AnswerCreateParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	answer := models.NewAnswer()
	answer.Text = params.Text
	answer.QuestionID = params.QuestionID
	answer.UserID = int(ctx.Get("user").(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))

	if err := answer.Create(); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(answer))
}

func AnswersGet(ctx echo.Context) error {
	var params shared.AnswersGetParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	user := models.NewUser()
	user.ID = params.UserID

	if err := user.GetAnswers(); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(user.Answers))
}
