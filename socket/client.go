package socket

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/websocket"
)

type client struct {
	conn   *websocket.Conn
	send   chan Event
	roomID int
	user   interface{}
}

func (c *client) joinRoom(id int) {
	c.roomID = id
}

func (c *client) readPump() {
	for {
		var e Event
		err := c.conn.ReadJSON(&e)

		if err != nil {
			Hub.Unregister <- c
			break
		}

		switch e.Type {
		case SET_TOKEN:
			if s, ok := e.Payload.(string); ok {
				token, _ := jwt.Parse(s, func(*jwt.Token) (interface{}, error) {
					return []byte("secret"), nil
				})
				c.user = token
			} else {
				c.user = nil
			}
		case JOIN_ROOM:
			id := int(e.Payload.(float64))
			c.joinRoom(id)
		case PING:
			c.send <- Event{
				Type: PONG,
			}
		}
	}
}

func (c *client) writePump() {
	for {
		e, ok := <-c.send

		if !ok {
			break
		}

		err := c.conn.WriteJSON(e)

		if err != nil {
			Hub.Unregister <- c
			break
		}
	}
}
