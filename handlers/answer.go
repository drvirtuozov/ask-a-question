package handlers

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/drvirtuozov/ask-a-question/models"

	"github.com/drvirtuozov/ask-a-question/shared"
	"github.com/labstack/echo"
)

func AnswerCreate(ctx echo.Context) error {
	var params shared.AnswerCreateParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	answer := models.NewAnswer()
	answer.Text = params.Text
	answer.Question.ID = &params.QuestionID
	answer.UserID = int(ctx.Get("user").(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))

	if err := answer.Create(); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(answer))
}

func AnswerGetComments(ctx echo.Context) error {
	var params shared.AnswerGetCommentsParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	answer := models.NewAnswer()
	answer.ID = params.AnswerID

	if err := answer.GetComments(); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(answer.Comments))
}
