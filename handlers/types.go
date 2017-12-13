package handlers

type okResponse struct {
	Ok   bool        `json:"ok"`
	Data interface{} `json:"data,omitempty"`
}

func newOKResponse(data interface{}) okResponse {
	return okResponse{
		Ok:   true,
		Data: data,
	}
}

type errResponse struct {
	Ok          bool   `json:"ok"`
	Description string `json:"description"`
}

func newErrResponse(err error) errResponse {
	return errResponse{
		Ok:          false,
		Description: err.Error(),
	}
}

type userGetParams struct {
	Username string `json:"username" form:"username" query:"username" validate:"required"`
}
