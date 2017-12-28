package handlers

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/labstack/echo"
)

// UserGet is a fetching user endpoint
func UserGet(ctx echo.Context) error {
	var params UserGetParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(&params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	user := models.User{
		Username: &params.Username,
	}

	if err := user.GetByUsername(); err != nil {
		return ctx.JSON(http.StatusNotFound, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(user))
}

// UserCreate is a creating user endpoint
func UserCreate(ctx echo.Context) error {
	var params UserCreateParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	user := models.User{
		Username:  &params.Username,
		Password:  params.Password,
		FirstName: &params.FirstName,
		LastName:  &params.LastName,
		Email:     params.Email,
	}

	token, err := user.Create()

	if err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(token))
}

func UserGetAnswers(ctx echo.Context) error {
	var params UserGetAnswersParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	user := models.User{
		ID: &params.UserID,
	}

	if err := user.GetAnswers(); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(user.Answers))
}

func UserGetQuestions(ctx echo.Context) error {
	ctxUser := ctx.Get("user")
	user := models.User{}
	userID := int(ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))
	user.ID = &userID

	if err := user.GetQuestions(); err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(user.Questions))
}
