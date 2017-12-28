package handlers

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/drvirtuozov/ask-a-question/models"

	"github.com/labstack/echo"
)

func CommentCreate(ctx echo.Context) error {
	var params CommentCreateParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	comment := models.Comment{
		Text:     params.Text,
		AnswerID: params.AnswerID,
		User:     models.User{},
	}

	userID := int(ctx.Get("user").(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))
	comment.User.ID = &userID

	if err := comment.Create(); err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(comment))
}
