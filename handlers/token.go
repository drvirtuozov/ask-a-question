package handlers

import (
	"net/http"

	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/labstack/echo"
)

// TokenCreate is a creating token endpoint
func TokenCreate(ctx echo.Context) error {
	var params TokenCreateParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	var token models.Token
	user := models.User{
		Username: &params.Username,
		Password: params.Password,
	}

	if err := token.Create(user); err != nil {
		return ctx.JSON(http.StatusUnauthorized, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(token))
}
