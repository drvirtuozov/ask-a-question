package handlers

type OKResponse struct {
	Ok   bool        `json:"ok"`
	Data interface{} `json:"data,omitempty"`
}

func NewOKResponse(data interface{}) *OKResponse {
	return &OKResponse{
		Ok:   true,
		Data: data,
	}
}

type ErrResponse struct {
	Ok          bool   `json:"ok"`
	Description string `json:"description"`
}

func NewErrResponse(err error) *ErrResponse {
	return &ErrResponse{
		Ok:          false,
		Description: err.Error(),
	}
}

type UserGetParams struct {
	Username string `json:"username" form:"username" query:"username" validate:"required"`
}
