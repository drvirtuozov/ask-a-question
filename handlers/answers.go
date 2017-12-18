package handlers

import (
	"net/http"

	"github.com/drvirtuozov/ask-a-question/models"

	"github.com/drvirtuozov/ask-a-question/shared"
	"github.com/labstack/echo"
)

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
