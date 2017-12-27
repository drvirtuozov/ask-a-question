package handlers

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/drvirtuozov/ask-a-question/models"

	"github.com/drvirtuozov/ask-a-question/shared"
	"github.com/labstack/echo"
)

func CommentsGet(ctx echo.Context) error {
	var params shared.CommentsGetParams

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

func CommentsCreate(ctx echo.Context) error {
	var params shared.CommentCreateParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	comment := models.NewComment()
	comment.Text = params.Text
	comment.AnswerID = params.AnswerID
	userID := int(ctx.Get("user").(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))
	comment.User.ID = &userID

	if err := comment.Create(); err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(comment))
}
