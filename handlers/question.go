package handlers

import (
	"net/http"

	"github.com/drvirtuozov/ask-a-question/socket"

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

	if user := ctx.Get("user"); user != nil {
		id := int(user.(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))
		params.FromID = &id
	}

	question := models.Question{
		UserID: params.UserID,
		Text:   params.Text,
		From: &models.User{
			ID: params.FromID,
		},
	}

	if err := question.Create(); err != nil {
		return err
	}

	socket.Hub.PersonalBroadcast <- socket.Event{
		Type:    socket.QUESTION_CREATED,
		Payload: question,
		RoomID:  params.UserID,
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

	socket.Hub.PersonalBroadcast <- socket.Event{
		Type:    socket.QUESTION_DELETED,
		Payload: question,
		RoomID:  question.UserID,
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

	socket.Hub.PersonalBroadcast <- socket.Event{
		Type:    socket.QUESTION_RESTORED,
		Payload: question,
		RoomID:  question.UserID,
	}
	return ctx.JSON(http.StatusOK, NewOKResponse(nil))
}
