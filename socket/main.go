package socket

import (
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var Hub = newHub()

func Handle(ctx echo.Context) error {
	conn, err := upgrader.Upgrade(ctx.Response(), ctx.Request(), nil)

	if err != nil {
		return err
	}

	c := &client{
		conn: conn,
		send: make(chan Event),
	}

	go c.readPump()
	go c.writePump()
	Hub.Register <- c
	return nil
}
