package main

import (
	"errors"
	"net/http"
)

type UsersGetParams struct {
	Usernames []string `form:"usernames"`
	UserIDs   []int    `form:"user_ids"`
}

func (ugp *UsersGetParams) Bind(r *http.Request) error {
	if len(ugp.UserIDs) == 0 && len(ugp.Usernames) == 0 {
		return errors.New("User ids or usernames are required")
	}

	return nil
}

type UsersPostParams struct {
	Username  string `json:"username"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
}

func (upp *UsersPostParams) Bind(r *http.Request) error {
	if upp.Username == "" {
		return errors.New("Username is required")
	}

	if upp.Password == "" {
		return errors.New("Password is required")
	}

	if upp.Email == "" {
		return errors.New("Email is required")
	}

	return nil
}

type UserResult struct {
	ID        int    `json:"id"`
	Username  string `json:"username"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Password  string `json:"-"`
}

type TokensPostParams struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (tpp *TokensPostParams) Bind(r *http.Request) error {
	if tpp.Username == "" {
		return errors.New("Username is required")
	}

	if tpp.Password == "" {
		return errors.New("Password is required")
	}

	return nil
}

type QuestionsPostParams struct {
	UserID int    `json:"user_id"`
	Text   string `json:"text"`
	FromID int
}

func (qpp *QuestionsPostParams) Bind(r *http.Request) error {
	if qpp.UserID == 0 {
		return errors.New("User id is required")
	}

	if qpp.Text == "" {
		return errors.New("Text is required")
	}

	return nil
}

type QuestionResult struct {
	ID        int    `json:"id"`
	Text      string `json:"text"`
	FromID    int    `json:"from_id,omitempty"`
	Timestamp int64  `json:"timestamp"`
}

type QuestionsDeleteParams struct {
	QuestionID int `json:"question_id"`
}

func (qdp *QuestionsDeleteParams) Bind(r *http.Request) error {
	if qdp.QuestionID == 0 {
		return errors.New("Question id is required")
	}

	return nil
}

type QuestionsPutParams struct {
	QuestionID int `json:"question_id"`
}

func (qpp *QuestionsPutParams) Bind(r *http.Request) error {
	if qpp.QuestionID == 0 {
		return errors.New("Question id is required")
	}

	return nil
}

type AnswersPostParams struct {
	QuestionID int    `json:"question_id"`
	Text       string `json:"text"`
}

func (app *AnswersPostParams) Bind(r *http.Request) error {
	if app.QuestionID == 0 {
		return errors.New("Question id is required")
	}

	if app.Text == "" {
		return errors.New("Text is required")
	}

	return nil
}

type AnswerResult struct {
	ID         int         `json:"id"`
	Text       string      `json:"text"`
	UserID     int         `json:"user_id"`
	QuestionID int         `json:"question_id"`
	Timestamp  int64       `json:"timestamp"`
	Likes      LikesResult `json:"likes"`
}

type CommentsGetParams struct {
	AnswerID int `form:"answer_id"`
}

func (cgp *CommentsGetParams) Bind(r *http.Request) error {
	if cgp.AnswerID == 0 {
		return errors.New("Answer id is required")
	}

	return nil
}

type CommentsPostParams struct {
	AnswerID int    `json:"answer_id"`
	Text     string `json:"text"`
	UserID   int
}

func (cpp *CommentsPostParams) Bind(r *http.Request) error {
	if cpp.AnswerID == 0 {
		return errors.New("Answer id is required")
	}

	if cpp.Text == "" {
		return errors.New("Text is required")
	}

	return nil
}

type CommentResult struct {
	ID        int    `json:"id"`
	Text      string `json:"text"`
	UserID    int    `json:"user_id"`
	Timestamp int64  `json:"timestamp"`
}

type AnswersGetParams struct {
	UserID int `form:"user_id"`
}

func (agp *AnswersGetParams) Bind(r *http.Request) error {
	if agp.UserID == 0 {
		return errors.New("User id is required")
	}

	return nil
}

type LikesPostParams struct {
	AnswerID int `json:"answer_id"`
	UserID   int
}

func (lpp *LikesPostParams) Bind(r *http.Request) error {
	if lpp.AnswerID == 0 {
		return errors.New("Answer id is required")
	}

	return nil
}

type LikesDeleteParams struct {
	AnswerID int `json:"answer_id"`
	UserID   int
}

func (ldp *LikesDeleteParams) Bind(r *http.Request) error {
	if ldp.AnswerID == 0 {
		return errors.New("Answer id is required")
	}

	return nil
}

type LikesGetParams struct {
	AnswerID int `form:"answer_id"`
}

func (lgp *LikesGetParams) Bind(r *http.Request) error {
	if lgp.AnswerID == 0 {
		return errors.New("Answer id is required")
	}

	return nil
}

type LikesResult struct {
	Count   int   `json:"count"`
	UserIDs []int `json:"user_ids,omitempty"`
}
