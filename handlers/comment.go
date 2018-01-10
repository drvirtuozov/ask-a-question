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

	ctxUser := ctx.Get("user").(*jwt.Token).Claims.(jwt.MapClaims)
	userID := int(ctxUser["id"].(float64))
	username := ctxUser["username"].(string)
	comment := models.Comment{
		Text:     params.Text,
		AnswerID: params.AnswerID,
		User: models.User{
			ID:       &userID,
			Username: &username,
		},
	}

	comment.User.ID = &userID

	if err := comment.Create(); err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(comment))
}
