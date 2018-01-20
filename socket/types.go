package socket

type Event struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload,omitempty"`
	RoomID  int         `json:"room_id,omitempty"`
}

const SET_TOKEN = "SET_TOKEN"
const JOIN_ROOM = "JOIN_ROOM"
const QUESTION_CREATED = "QUESTION_CREATED"
const QUESTION_DELETED = "QUESTION_DELETED"
const QUESTION_RESTORED = "QUESTION_RESTORED"
const QUESTION_DESTROYED = "QUESTION_DESTROYED"
const ANSWER_CREATED = "ANSWER_CREATED"
const COMMENT_CREATED = "COMMENT_CREATED"
const PING = "PING"
const PONG = "PONG"
