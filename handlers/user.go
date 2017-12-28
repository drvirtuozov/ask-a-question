package handlers

import (
	"net/http"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/drvirtuozov/ask-a-question/shared"
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

	user := models.NewUser()

	if err := user.GetByUsername(params.Username); err != nil {
		return ctx.JSON(http.StatusNotFound, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(user))
}

// UserCreate is a creating user endpoint
func UserCreate(ctx echo.Context) error {
	var params shared.UserCreateParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	user := models.NewUser()
	token, err := user.Create(params)

	if err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(token))
}

func UserGetAnswers(ctx echo.Context) error {
	var params shared.UserGetAnswersParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	user := models.NewUser()
	user.ID = &params.UserID

	if err := user.GetAnswers(); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(user.Answers))
}

func UserGetQuestions(ctx echo.Context) error {
	ctxUser := ctx.Get("user")
	user := models.NewUser()
	userID := int(ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))
	user.ID = &userID

	if err := user.GetQuestions(); err != nil {
		return err
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(user.Questions))
}
