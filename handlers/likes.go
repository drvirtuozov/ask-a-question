package handlers

import (
	"net/http"

	"github.com/drvirtuozov/ask-a-question/models"

	"github.com/drvirtuozov/ask-a-question/shared"
	"github.com/labstack/echo"
)

func LikesGet(ctx echo.Context) error {
	var params shared.LikesGetParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	answer := models.NewAnswer()
	answer.ID = params.AnswerID

	if err := answer.GetLikes(); err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(answer.Likes))
}
