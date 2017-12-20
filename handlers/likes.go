package handlers

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
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

func LikesCreate(ctx echo.Context) error {
	var params shared.LikeCreateParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	like := models.NewLike()
	like.AnswerID = params.AnswerID
	like.UserID = int(ctx.Get("user").(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))

	if err := like.Create(); err != nil {
		return err
	}

	answer := models.NewAnswer()
	answer.ID = params.AnswerID

	if err := answer.GetLikes(); err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(answer.Likes))
}

func LikesDelete(ctx echo.Context) error {
	var params shared.LikeDeleteParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	like := models.NewLike()
	like.AnswerID = params.AnswerID
	like.UserID = int(ctx.Get("user").(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))

	if err := like.Delete(); err != nil {
		return err
	}

	answer := models.NewAnswer()
	answer.ID = params.AnswerID

	if err := answer.GetLikes(); err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(answer.Likes))
}
