package shared

type UserCreateParams struct {
	Username  string `json:"username" form:"username" query:"username" validate:"required"`
	Password  string `json:"password" form:"password" query:"password" validate:"required"`
	FirstName string `json:"first_name" form:"first_name" query:"first_name"`
	LastName  string `json:"last_name" form:"last_name" query:"last_name"`
	Email     string `json:"email" form:"email" query:"email" validate:"required,email"`
}

type TokenCreateParams struct {
	Username string `json:"username" form:"username" query:"username" validate:"required"`
	Password string `json:"password" form:"password" query:"password" validate:"required"`
}

type QuestionCreateParams struct {
	UserID int    `json:"user_id" form:"user_id" query:"user_id" validate:"required"`
	Text   string `json:"text" form:"text" query:"text" validate:"required"`
	FromID *int
}

type QuestionDeleteParams struct {
	ID int `json:"id" form:"id" query:"id" validate:"required"`
}

type QuestionRestoreParams struct {
	QuestionDeleteParams
}

type AnswerCreateParams struct {
	QuestionID int    `json:"question_id" form:"question_id" query:"question_id" validate:"required"`
	Text       string `json:"text" form:"text" query:"text" validate:"required"`
}

type AnswersGetParams struct {
	UserID int `json:"user_id" form:"user_id" query:"user_id" validate:"required"`
}
