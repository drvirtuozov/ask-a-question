package socket

import (
	"github.com/dgrijalva/jwt-go"
)

type hub struct {
	clients           map[*client]bool
	Broadcast         chan Event
	PersonalBroadcast chan Event
	rooms             map[int]room
	Register          chan *client
	Unregister        chan *client
}

func newHub() *hub {
	return &hub{
		clients:           make(map[*client]bool),
		Broadcast:         make(chan Event),
		PersonalBroadcast: make(chan Event),
		rooms:             make(map[int]room),
		Register:          make(chan *client),
		Unregister:        make(chan *client),
	}
}

func (h *hub) Run() {
	for {
		select {
		case c := <-h.Register:
			h.clients[c] = true
		case c := <-h.Unregister:
			if _, ok := h.clients[c]; ok {
				delete(h.clients, c)
				close(c.send)
				c.conn.Close()

				if r := h.rooms[c.roomID]; len(r) == 1 {
					delete(h.rooms, c.roomID)
					close(r)
				}
			}
		case e := <-h.Broadcast:
			if r, ok := h.rooms[e.RoomID]; ok {
				r <- e
			} else {
				r := make(room)
				go r.readPump(h.clients)
				h.rooms[e.RoomID] = r
				r <- e
			}
		case e := <-h.PersonalBroadcast:
			for c := range h.clients {
				if c.user != nil && int(c.user.(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64)) == e.RoomID {
					c.send <- e
				}
			}
		}
	}
}
