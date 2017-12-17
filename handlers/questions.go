package handlers

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/drvirtuozov/ask-a-question/shared"
	"github.com/labstack/echo"
)

func QuestionsCreate(ctx echo.Context) error {
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
