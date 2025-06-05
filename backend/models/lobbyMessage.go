package models

import (
	"github.com/gorilla/websocket"
)

type LobbyMessage struct {
	Type string
	Msg  any
	Conn *websocket.Conn
}

type LiveMessage struct {
	Type string
	Msg  any
	Conn *websocket.Conn
}
