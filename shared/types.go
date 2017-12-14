package shared

type UserCreateParams struct {
	Username  string `json:"username" form:"username" query:"username" validate:"required"`
	Password  string `json:"password" form:"password" query:"password" validate:"required"`
	FirstName string `json:"first_name" form:"first_name" query:"first_name"`
	LastName  string `json:"last_name" form:"last_name" query:"last_name"`
	Email     string `json:"email" form:"email" query:"email" validate:"required,email"`
}
