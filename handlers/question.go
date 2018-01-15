package handlers

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/labstack/echo"
)

func QuestionCreate(ctx echo.Context) error {
	var params QuestionCreateParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	var fromID *int

	if user := ctx.Get("user"); user != nil {
		id := int(user.(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))
		fromID = &id
	}

	question := models.Question{
		UserID: params.UserID,
		Text:   params.Text,
		From: &models.User{
			ID: fromID,
		},
	}

	if err := question.Create(); err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(question))
}

func QuestionDelete(ctx echo.Context) error {
	var params QuestionDeleteParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	question := models.Question{
		ID:     &params.ID,
		UserID: int(ctx.Get("user").(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64)),
	}

	if err := question.Delete(); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(nil))
}

func QuestionRestore(ctx echo.Context) error {
	var params QuestionRestoreParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	question := models.Question{
		ID:     &params.ID,
		UserID: int(ctx.Get("user").(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64)),
	}

	if err := question.Restore(); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(nil))
}
