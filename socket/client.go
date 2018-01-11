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
		}

		switch e.Type {
		case SET_TOKEN:
			token, err := jwt.Parse(e.Payload.(string), nil)

			if err != nil {
				Hub.Unregister <- c
			}

			c.user = token
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
		}
	}
}