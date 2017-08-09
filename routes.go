package main

import (
	"errors"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/render"
	"net/http"
	"strings"
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
	Errs       []error     `json:"-"`
	StatusCode int         `json:"-"`
	Ok         bool        `json:"ok"`
	Errors     []ErrorInfo `json:"errors"`
}

func (e ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.StatusCode)
	return nil
}

func ErrorsToErrorInfo(errs []error) []ErrorInfo {
	var errsInfo []ErrorInfo

	for _, err := range errs {
		errsInfo = append(errsInfo, ErrorInfo{
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
		})
	}

	return errsInfo
}

func ErrBadRequest(errs []error) render.Renderer {
	return ErrResponse{
		Errs:       errs,
		StatusCode: http.StatusBadRequest,
		Ok:         false,
		Errors:     ErrorsToErrorInfo(errs),
	}
}

func ErrInternalError(errs []error) render.Renderer {
	return ErrResponse{
		Errs:       errs,
		StatusCode: http.StatusInternalServerError,
		Ok:         false,
		Errors:     ErrorsToErrorInfo(errs),
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
					render.Render(w, r, ErrBadRequest(append([]error{}, err)))
					return
				}

				user := User{
					Username: params.Username,
					Password: params.Password,
					Email:    params.Email,
				}

				errs := db.Create(&user).GetErrors()

				if len(errs) > 0 {
					render.Render(w, r, ErrBadRequest(errs))
					return
				}

				token, err := user.Sign()

				if err != nil {
					render.Render(w, r, ErrInternalError(append([]error{}, err)))
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
					render.Render(w, r, ErrBadRequest(append([]error{}, err)))
					return
				}

				user := User{}
				err := db.Find(&user, "username = ?", params.Username).Error

				if err != nil {
					render.Render(w, r, ErrBadRequest(append([]error{}, err)))
					return
				}

				if !user.ComparePassword(params.Password) {
					render.Render(w, r, ErrBadRequest(append([]error{}, errors.New("Wrong password"))))
					return
				}

				token, err := user.Sign()

				if err != nil {
					render.Render(w, r, ErrInternalError(append([]error{}, err)))
					return
				}

				render.Render(w, r, OKResponse{
					Data: token,
					Ok:   true,
				})
			})
		})
	})
}
