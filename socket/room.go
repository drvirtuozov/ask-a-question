package socket

import "fmt"

type room chan Event

func (r room) readPump(clients map[*client]bool) {
	for {
		e, ok := <-r

		if !ok {
			break
		}

		fmt.Printf("message to %d room id", e.RoomID)
		for c := range clients {
			if c.roomID == e.RoomID {
				c.send <- e
			}
		}
	}
}
