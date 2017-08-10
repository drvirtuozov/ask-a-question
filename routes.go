package main

import (
	"errors"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/render"
	"net/http"
	"strings"
	"github.com/dgrijalva/jwt-go"
)

var r *chi.Mux

type OKResponse struct {
	Data interface{} `json:"data,omitempty"`
	Ok   bool        `json:"ok"`
}

func (or OKResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, 200)
	return nil
}

type ErrorInfo struct {
	Field  string `json:"field,omitempty"`
	Detail string `json:"detail"`
}

type ErrResponse struct {
	Err        error     `json:"-"`
	StatusCode int       `json:"-"`
	Ok         bool      `json:"ok"`
	Error      ErrorInfo `json:"error"`
}

func (e ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.StatusCode)
	return nil
}

func ErrorToErrorInfo(err error) ErrorInfo {
	return ErrorInfo{
		Field: func(errText string) string {
			text := strings.ToLower(errText)
			fields := []string{
				"username", "password", "email",
			}
			for _, v := range fields {
				if strings.Contains(text, v) {
					return v
				}
			}
			return ""
		}(err.Error()),
		Detail: err.Error(),
	}
}

func ErrBadRequest(err error) render.Renderer {
	return ErrResponse{
		Err:        err,
		StatusCode: http.StatusBadRequest,
		Ok:         false,
		Error:      ErrorToErrorInfo(err),
	}
}

func ErrInternalError(err error) render.Renderer {
	return ErrResponse{
		Err:        err,
		StatusCode: http.StatusInternalServerError,
		Ok:         false,
		Error:      ErrorToErrorInfo(err),
	}
}

func init() {
	r = chi.NewRouter()
	r.Use(middleware.Logger)
	r.Route("/api", func(r chi.Router) {
		r.Use(JWTMiddleware().Handler)
		r.Route("/users", func(r chi.Router) {
			r.Get("/{username}", func(w http.ResponseWriter, r *http.Request) {

			})

			r.Post("/", func(w http.ResponseWriter, r *http.Request) {
				var params UserCreateParams

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				user := User{
					Username: params.Username,
					Password: params.Password,
					Email:    params.Email,
				}

				if err := db.Create(&user).Error; err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				token, err := user.Sign()

				if err != nil {
					render.Render(w, r, ErrInternalError(err))
					return
				}

				render.Render(w, r, OKResponse{
					Data: token,
					Ok:   true,
				})
			})
		})

		r.Route("/tokens", func(r chi.Router) {
			r.Post("/", func(w http.ResponseWriter, r *http.Request) {
				var params TokenCreateParams

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				user := User{}
				err := db.Find(&user, "username = ?", params.Username).Error

				if err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				if !user.ComparePassword(params.Password) {
					render.Render(w, r, ErrBadRequest(errors.New("Wrong password")))
					return
				}

				token, err := user.Sign()

				if err != nil {
					render.Render(w, r, ErrInternalError(err))
					return
				}

				render.Render(w, r, OKResponse{
					Data: token,
					Ok:   true,
				})
			})
		})

		r.Route("/questions", func(r chi.Router) {
			r.Post("/", func(w http.ResponseWriter, r *http.Request) {
				var params QuestionCreateParams

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				var fromId uint = 0
				user := User{}

				if value := r.Context().Value("user"); value != nil {
					fromId = uint(value.(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))
				}

				question := UserQuestion{
					Text:   params.Text,
					FromId: fromId,
				}

				err := db.Find(&user, "id = ?", params.UserId).Association("UserQuestions").Append(&question).Error

				if err != nil {
					render.Render(w, r, ErrBadRequest(errors.New("User not found")))
					return
				}

				render.Render(w, r, OKResponse{
					Data: QuestionCreateResult{
						Id: question.ID,
						Text: question.Text,
						FromId: question.FromId,
						Timestamp: question.CreatedAt.Unix(),
					},
					Ok:   true,
				})
			})
		})
	})
}
