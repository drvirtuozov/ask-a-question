package socket

type Event struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
	RoomID  int         `json:"room_id"`
}

const SET_TOKEN = "SET_TOKEN"
const QUESTION_CREATED = "QUESTION_CREATED"
const QUESTION_DELETED = "QUESTION_DELETED"
const QUESTION_RESTORED = "QUESTION_RESTORED"
