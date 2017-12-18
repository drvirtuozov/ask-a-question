package models

type Answer struct {
	ID         int    `json:"id"`
	Text       string `json:"text"`
	UserID     int    `json:"user_id"`
	QuestionID int    `json:"question_id"`
	Timestamp  int64  `json:"timestamp"`
	// Likes      LikesResult `json:"likes"`
}
