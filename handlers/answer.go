package handlers

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/drvirtuozov/ask-a-question/models"

	"github.com/labstack/echo"
)

func AnswerCreate(ctx echo.Context) error {
	var params AnswerCreateParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	answer := models.Answer{
		Text:   params.Text,
		UserID: int(ctx.Get("user").(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64)),
		Question: models.Question{
			ID: &params.QuestionID,
		},
	}

	if err := answer.Create(); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(answer))
}

func AnswerGet(ctx echo.Context) error {
	var params AnswerGetParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	answer := models.Answer{
		ID: params.AnswerID,
	}

	if err := answer.Get(); err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(answer))
}

func AnswerGetComments(ctx echo.Context) error {
	var params AnswerGetCommentsParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	answer := models.Answer{
		ID: params.AnswerID,
	}

	if err := answer.GetComments(); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(answer.Comments))
}
