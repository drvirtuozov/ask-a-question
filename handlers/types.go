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

type UserCreateParams struct {
	Username  string `json:"username" form:"username" query:"username" validate:"required"`
	Password  string `json:"password" form:"password" query:"password" validate:"required"`
	FirstName string `json:"first_name" form:"first_name" query:"first_name" validate:"required"`
	Email     string `json:"email" form:"email" query:"email" validate:"required,email"`
}

type TokenCreateParams struct {
	Username string `json:"username" form:"username" query:"username" validate:"required"`
	Password string `json:"password" form:"password" query:"password" validate:"required"`
}

type QuestionCreateParams struct {
	UserID int    `json:"user_id" form:"user_id" query:"user_id" validate:"required"`
	Text   string `json:"text" form:"text" query:"text" validate:"required"`
}

type QuestionDeleteParams struct {
	ID int `json:"id" form:"id" query:"id" validate:"required"`
}

type QuestionRestoreParams QuestionDeleteParams

type AnswerCreateParams struct {
	QuestionID int    `json:"question_id" form:"question_id" query:"question_id" validate:"required"`
	Text       string `json:"text" form:"text" query:"text" validate:"required"`
}

type AnswerGetParams struct {
	AnswerID int `json:"answer_id" form:"answer_id" query:"answer_id" validate:"required"`
}

type UserGetAnswersParams struct {
	UserID int `json:"user_id" form:"user_id" query:"user_id" validate:"required"`
}

type AnswerGetCommentsParams struct {
	AnswerID int `json:"answer_id" form:"answer_id" query:"answer_id" validate:"required"`
}

type CommentCreateParams struct {
	AnswerID int    `json:"answer_id" form:"answer_id" query:"answer_id" validate:"required"`
	Text     string `json:"text" form:"text" query:"text" validate:"required"`
}

type LikesGetParams struct {
	AnswerID int `json:"answer_id" form:"answer_id" query:"answer_id" validate:"required"`
}

type LikeCreateParams LikesGetParams
type LikeDeleteParams LikesGetParams
