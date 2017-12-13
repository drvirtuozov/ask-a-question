package handlers

import (
	"net/http"

	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/labstack/echo"
)

func UserGet(ctx echo.Context) error {
	var params userGetParams

	if err := ctx.Bind(&params); err != nil {
		return err
	}

	if err := ctx.Validate(&params); err != nil {
		return ctx.JSON(http.StatusBadRequest, newErrResponse(err))
	}

	user := models.NewUser()

	if err := user.GetByUsername(params.Username); err != nil {
		return ctx.JSON(http.StatusNotFound, newErrResponse(err))
	}

	return ctx.JSON(http.StatusOK, newOKResponse(user))
}
