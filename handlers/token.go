package handlers

import (
	"net/http"

	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/drvirtuozov/ask-a-question/shared"
	"github.com/labstack/echo"
)

// TokenCreate is a creating token endpoint
func TokenCreate(ctx echo.Context) error {
	var params shared.TokenCreateParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(params); err != nil {
		return ctx.JSON(http.StatusBadRequest, NewErrResponse(err))
	}

	token := models.NewToken()

	if err := token.Create(params); err != nil {
		return ctx.JSON(http.StatusUnauthorized, NewErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, NewOKResponse(token))
}
