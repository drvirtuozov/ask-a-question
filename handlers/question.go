package handlers

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/drvirtuozov/ask-a-question/shared"
	"github.com/labstack/echo"
)

func QuestionCreate(ctx echo.Context) error {
	var params shared.QuestionCreateParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	if user := ctx.Get("user"); user != nil {
		id := int(user.(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))
		params.FromID = &id
	}

	question := models.NewQuestion()

	if err := question.Create(params); err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(question))
}

func QuestionDelete(ctx echo.Context) error {
	var params shared.QuestionDeleteParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	question := models.NewQuestion()
	question.ID = &params.ID
	question.UserID = int(ctx.Get("user").(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))

	if err := question.Delete(); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(nil))
}

func QuestionRestore(ctx echo.Context) error {
	var params shared.QuestionRestoreParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	question := models.NewQuestion()
	question.ID = &params.ID
	question.UserID = int(ctx.Get("user").(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))

	if err := question.Restore(); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(nil))
}