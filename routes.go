package main

import (
	"errors"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/render"
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
	render.Decode = customDecoder
	r = chi.NewRouter()
	r.Use(middleware.Logger)
	r.Route("/api", func(api chi.Router) {
		api.Use(JWTMiddleware().Handler)
		api.Route("/users", func(users chi.Router) {
			users.Get("/", func(w http.ResponseWriter, r *http.Request) {
				var err error
				var params UsersGetParams
				user := User{}

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				if params.UserID != 0 {
					err = db.Find(&user, "id = ?", params.UserID).Error
				} else {
					err = db.Find(&user, "username = ?", params.Username).Error
				}

				if err != nil {
					render.Render(w, r, ErrNotFound(errors.New("User not found")))
					return
				}

				render.Render(w, r, OKResponse{
					Data: UserResult{
						ID:        user.ID,
						Username:  user.Username,
						FirstName: user.FirstName,
						LastName:  user.LastName,
					},
					Ok: true,
				})
			})

			users.Post("/", func(w http.ResponseWriter, r *http.Request) {
				var params UsersPostParams

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
				var params TokensPostParams

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
			questions.Get("/", func(w http.ResponseWriter, r *http.Request) {
				ctxUser := r.Context().Value("user")

				if ctxUser == nil {
					render.Render(w, r, ErrUnauthorized(errors.New("Token is not provided")))
					return
				}

				userID := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				user := User{}
				questions := []*UserQuestion{}
				err := db.Order("id DESC").Find(&user, "id = ?", userID).Related(&questions).Error

				if err != nil {
					render.Render(w, r, ErrNotFound(errors.New("User not found")))
					return
				}

				var mappedQuestions []QuestionResult

				for _, question := range questions {
					mappedQuestions = append(mappedQuestions, QuestionResult{
						ID:        question.ID,
						Text:      question.Text,
						FromID:    question.FromID,
						Timestamp: question.CreatedAt.Unix(),
					})
				}

				render.Render(w, r, OKResponse{
					Ok:   true,
					Data: mappedQuestions,
				})
			})

			questions.Post("/", func(w http.ResponseWriter, r *http.Request) {
				var params QuestionsPostParams

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				var fromID uint
				user := User{}

				if value := r.Context().Value("user"); value != nil {
					fromID = uint(value.(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))
				}

				question := UserQuestion{
					Text:   params.Text,
					FromID: fromID,
				}

				err := db.Find(&user, "id = ?", params.UserID).Association("UserQuestions").Append(&question).Error

				if err != nil {
					render.Render(w, r, ErrBadRequest(errors.New("User not found")))
					return
				}

				render.Render(w, r, OKResponse{
					Data: QuestionResult{
						ID:        question.ID,
						Text:      question.Text,
						FromID:    question.FromID,
						Timestamp: question.CreatedAt.Unix(),
					},
					Ok: true,
				})
			})

			questions.Delete("/", func(w http.ResponseWriter, r *http.Request) {
				var params QuestionsDeleteParams

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				ctxUser := r.Context().Value("user")

				if ctxUser == nil {
					render.Render(w, r, ErrUnauthorized(errors.New("Token is not provided")))
					return
				}

				userID := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				err := db.Delete(UserQuestion{}, "id = ? AND user_id = ?", params.QuestionID, userID).Error

				if err != nil {
					render.Render(w, r, ErrBadRequest(errors.New("Question not found")))
					return
				}

				render.Render(w, r, OKResponse{
					Ok: true,
				})
			})

			questions.Put("/", func(w http.ResponseWriter, r *http.Request) { // undelete question
				var params QuestionsPutParams

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				ctxUser := r.Context().Value("user")

				if ctxUser == nil {
					render.Render(w, r, ErrUnauthorized(errors.New("Token is not provided")))
					return
				}

				userID := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				err := db.Model(&UserQuestion{}).Unscoped().Where("id = ? AND user_id = ?", params.QuestionID, userID).Update("deleted_at", nil).Error

				if err != nil {
					render.Render(w, r, ErrNotFound(errors.New("Question not found")))
					return
				}

				render.Render(w, r, OKResponse{
					Ok: true,
				})
			})
		})

		api.Route("/answers", func(answers chi.Router) {
			answers.Get("/", func(w http.ResponseWriter, r *http.Request) {
				var params AnswersGetParams

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				answers := []*UserAnswer{}
				user := User{}
				err := db.Order("id DESC").Find(&user, "id = ?", params.UserID).Related(&answers).Error

				if err != nil {
					render.Render(w, r, ErrNotFound(errors.New("User not found")))
					return
				}

				var mappedAnswers []AnswerResult

				for _, answer := range answers {
					mappedAnswers = append(mappedAnswers, AnswerResult{
						ID:         answer.ID,
						Text:       answer.Text,
						UserID:     answer.UserID,
						QuestionID: answer.UserQuestionID,
						Timestamp:  answer.CreatedAt.Unix(),
					})
				}

				render.Render(w, r, OKResponse{
					Ok:   true,
					Data: mappedAnswers,
				})
			})

			answers.Post("/", func(w http.ResponseWriter, r *http.Request) {
				var params AnswersPostParams

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				ctxUser := r.Context().Value("user")

				if ctxUser == nil {
					render.Render(w, r, ErrUnauthorized(errors.New("Token is not provided")))
					return
				}

				userID := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				question := UserQuestion{}
				err := db.Find(&question, "id = ? AND user_answer_id IS NULL AND user_id = ?", params.QuestionID, userID).Error

				if err != nil {
					render.Render(w, r, ErrBadRequest(errors.New("Question not found")))
					return
				}

				user := User{}
				answer := UserAnswer{
					Text:           params.Text,
					UserQuestionID: question.ID,
				}

				err = db.Find(&user, "id = ?", userID).Association("UserAnswers").Append(&answer).Error

				if err != nil {
					render.Render(w, r, ErrNotFound(errors.New("User not found")))
				}

				question.UserAnswerID = answer.ID
				db.Save(&question)

				render.Render(w, r, OKResponse{
					Data: AnswerResult{
						ID:         answer.ID,
						Text:       answer.Text,
						UserID:     answer.UserID,
						QuestionID: question.ID,
						Timestamp:  answer.CreatedAt.Unix(),
					},
					Ok: true,
				})
			})
		})

		api.Route("/comments", func(comments chi.Router) {
			comments.Post("/", func(w http.ResponseWriter, r *http.Request) {
				var params CommentsPostParams

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				ctxUser := r.Context().Value("user")

				if ctxUser == nil {
					render.Render(w, r, ErrUnauthorized(errors.New("Token is not provided")))
					return
				}

				userID := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				comment := AnswerComment{
					UserID: uint(userID.(float64)),
					Text:   params.Text,
				}

				err := db.Find(&UserAnswer{}, "id = ?", params.AnswerID).Association("AnswerComments").Append(&comment).Error

				if err != nil {
					render.Render(w, r, ErrNotFound(errors.New("Answer not found")))
					return
				}

				render.Render(w, r, OKResponse{
					Data: CommentResult{
						Id:        comment.ID,
						UserID:    comment.UserID,
						Text:      comment.Text,
						Timestamp: comment.CreatedAt.Unix(),
					},
					Ok: true,
				})
			})
		})

		api.Route("/likes", func(likes chi.Router) {
			likes.Get("/", func(w http.ResponseWriter, r *http.Request) {
				var params LikesGetParams

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				answer := UserAnswer{}
				answer.ID = uint(params.AnswerID)
				likes := []*AnswerLike{}
				err := db.Model(&answer).Related(&likes).Error

				if err != nil {
					render.Render(w, r, ErrNotFound(errors.New("Answer not found")))
					return
				}

				var userIDs []uint

				for _, like := range likes {
					userIDs = append(userIDs, like.UserID)
				}

				render.Render(w, r, OKResponse{
					Ok: true,
					Data: LikesResult{
						Count:   len(userIDs),
						UserIDs: userIDs,
					},
				})
			})

			likes.Post("/", func(w http.ResponseWriter, r *http.Request) {
				var params LikesPostParams

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				ctxUser := r.Context().Value("user")

				if ctxUser == nil {
					render.Render(w, r, ErrUnauthorized(errors.New("Token is not provided")))
					return
				}

				userID := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64)

				like := AnswerLike{
					UserID: uint(userID),
				}

				userAnswer := UserAnswer{}
				userAnswer.ID = uint(params.AnswerID)
				var answerLikes []AnswerLike

				err := db.Find(&userAnswer).Association("AnswerLikes").Append(&like).Find(&answerLikes).Error

				if err != nil {
					render.Render(w, r, ErrNotFound(errors.New("Answer not found")))
					return
				}

				var userIDs []uint

				for _, like := range answerLikes {
					userIDs = append(userIDs, like.UserID)
				}

				render.Render(w, r, OKResponse{
					Ok: true,
					Data: LikesResult{
						Count:   len(answerLikes),
						UserIDs: userIDs,
					},
				})
			})

			likes.Delete("/", func(w http.ResponseWriter, r *http.Request) {
				var params LikesDeleteParams

				if err := render.Bind(r, &params); err != nil {
					render.Render(w, r, ErrBadRequest(err))
					return
				}

				ctxUser := r.Context().Value("user")

				if ctxUser == nil {
					render.Render(w, r, ErrUnauthorized(errors.New("Token is not provided")))
					return
				}

				userID := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				var answerLikes []AnswerLike
				err := db.Delete(&AnswerLike{}, "user_id = ? AND user_answer_id = ?", userID, params.AnswerID).Find(&answerLikes).Error

				if err != nil {
					render.Render(w, r, ErrNotFound(errors.New("Answer not found")))
					return
				}

				var userIDs []uint

				for _, like := range answerLikes {
					userIDs = append(userIDs, like.UserID)
				}

				render.Render(w, r, OKResponse{
					Ok: true,
					Data: LikesResult{
						Count:   len(answerLikes),
						UserIDs: userIDs,
					},
				})
			})
		})
	})
}
