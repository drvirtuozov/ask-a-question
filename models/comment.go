package models

type Comment struct {
	ID        int    `json:"id"`
	Text      string `json:"text"`
	UserID    int    `json:"user_id"`
	Timestamp int64  `json:"timestamp"`
}
