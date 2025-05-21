package models

import "github.com/gorilla/websocket"

type LobbyMessage struct {
	Msg  string
	Conn *websocket.Conn
}
