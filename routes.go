package main

import (
	"errors"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/render"
	"net/http"
	"strings"
	"github.com/dgrijalva/jwt-go"
	"strconv"
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

func ErrUnauthorized(err error) render.Renderer {
	return ErrResponse{
		Err:        err,
		StatusCode: http.StatusUnauthorized,
		Ok:         false,
		Error:      ErrorToErrorInfo(err),
	}
}

func ErrNotFound(err error) render.Renderer {
	return ErrResponse{
		Err:        err,
		StatusCode: http.StatusNotFound,
		Ok:         false,
		Error:      ErrorToErrorInfo(err),
	}
}

func init() {
	r = chi.NewRouter()
	r.Use(middleware.Logger)
	r.Route("/api", func(api chi.Router) {
		api.Use(JWTMiddleware().Handler)
		api.Route("/users", func(users chi.Router) {
			users.Get("/{username}", func(w http.ResponseWriter, r *http.Request) {

			})

			users.Post("/", func(w http.ResponseWriter, r *http.Request) {
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

		api.Route("/tokens", func(tokens chi.Router) {
			tokens.Post("/", func(w http.ResponseWriter, r *http.Request) {
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

		api.Route("/questions", func(questions chi.Router) {
			questions.Post("/", func(w http.ResponseWriter, r *http.Request) {
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

			questions.Route("/{question_id}", func(question chi.Router) {
				question.Delete("/", func(w http.ResponseWriter, r *http.Request) {
					questionId, err := strconv.Atoi(chi.URLParam(r, "question_id"))

					if err != nil {
						render.Render(w, r, ErrBadRequest(errors.New("Question id must be integer")))
						return
					}

					ctxUser := r.Context().Value("user")

					if ctxUser == nil {
						render.Render(w, r, ErrUnauthorized(errors.New("Token is not provided")))
						return
					}

					userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
					err = db.Delete(UserQuestion{}, "id = ? AND user_id = ?", questionId, userId).Error

					if err != nil {
						render.Render(w, r, ErrBadRequest(errors.New("Question not found")))
						return
					}

					render.Render(w, r, OKResponse{
						Ok: true,
					})
				})

				question.Put("/", func(w http.ResponseWriter, r *http.Request) { // undelete question
					questionId, err := strconv.Atoi(chi.URLParam(r, "question_id"))

					if err != nil {
						render.Render(w, r, ErrBadRequest(errors.New("Question id must be integer")))
						return
					}

					ctxUser := r.Context().Value("user")

					if ctxUser == nil {
						render.Render(w, r, ErrUnauthorized(errors.New("Token is not provided")))
						return
					}

					userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
					err = db.Model(&UserQuestion{}).Unscoped().Where("id = ? AND user_id = ?", questionId, userId).Update("deleted_at", nil).Error

					if err != nil {
						render.Render(w, r, ErrNotFound(errors.New("Question not found")))
						return
					}

					render.Render(w, r, OKResponse{
						Ok: true,
					})
				})
			})
		})

		api.Route("/answers", func(answers chi.Router) {
			answers.Post("/", func(w http.ResponseWriter, r *http.Request) {
				var params AnswerCreateParams

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				ctxUser := r.Context().Value("user")

				if ctxUser == nil {
					render.Render(w, r, ErrUnauthorized(errors.New("Token is not provided")))
					return
				}

				userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				question := UserQuestion{}
				err := db.Find(&question, "id = ? AND user_answer_id IS NULL AND user_id = ?", params.QuestionId, userId).Error

				if err != nil {
					render.Render(w, r, ErrBadRequest(errors.New("Question not found")))
					return
				}

				user := User{}
				answer := UserAnswer{
					Text:           params.Text,
					UserQuestionId: question.ID,
				}

				err = db.Find(&user, "id = ?", userId).Association("UserAnswers").Append(&answer).Error

				if err != nil {
					render.Render(w, r, ErrNotFound(errors.New("User not found")))
				}

				question.UserAnswerId = answer.ID
				db.Save(&question)

				render.Render(w, r, OKResponse{
					Data: AnswerCreateResult{
						Id: answer.ID,
						Text: answer.Text,
						UserId: answer.UserId,
						QuestionId: question.ID,
						Timestamp: answer.CreatedAt.Unix(),
					},
					Ok:   true,
				})
			})

			answers.Route("/{answer_id}", func(answer chi.Router) {
				answer.Route("/comments", func(answerComments chi.Router) {
					answerComments.Post("/", func(w http.ResponseWriter, r *http.Request) {
						answerId, err := strconv.Atoi(chi.URLParam(r, "answer_id"))

						if err != nil {
							render.Render(w, r, ErrBadRequest(errors.New("Answer id must be integer")))
							return
						}

						var params CommentCreateParams

						if err := render.Bind(r, &params); err != nil {
							render.Render(w, r, ErrBadRequest(err))
							return
						}

						ctxUser := r.Context().Value("user")

						if ctxUser == nil {
							render.Render(w, r, ErrUnauthorized(errors.New("Token is not provided")))
							return
						}

						userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
						comment := AnswerComment{
							UserId: uint(userId.(float64)),
							Text:   params.Text,
						}

						err = db.Find(&UserAnswer{}, "id = ?", answerId).Association("AnswerComments").Append(&comment).Error

						if err != nil {
							render.Render(w, r, ErrNotFound(errors.New("Answer not found")))
							return
						}

						render.Render(w, r, OKResponse{
							Data: CommentCreateResult{
								Id: comment.ID,
								UserId: comment.UserId,
								Text: comment.Text,
								Timestamp: comment.CreatedAt.Unix(),
							},
							Ok: true,
						})
					})
				})

				answer.Route("/likes", func(answerLikes chi.Router) {
					answerLikes.Post("/", func(w http.ResponseWriter, r *http.Request) {
						answerId, err := strconv.Atoi(chi.URLParam(r, "answer_id"))

						if err != nil {
							render.Render(w, r, ErrBadRequest(errors.New("Answer id must be integer")))
							return
						}

						ctxUser := r.Context().Value("user")

						if ctxUser == nil {
							render.Render(w, r, ErrUnauthorized(errors.New("Token is not provided")))
							return
						}

						userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]

						like := &AnswerLike{
							UserId: uint(userId.(float64)),
						}

						err = db.Find(&UserAnswer{}, "id = ?", answerId).Association("AnswerLikes").Append(like).Error

						if err != nil {
							render.Render(w, r, ErrNotFound(errors.New("Answer not found")))
							return
						}

						render.Render(w, r, OKResponse{
							Ok: true,
						})
					})
				})
			})
		})
	})
}
