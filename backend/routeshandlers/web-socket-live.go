package routeshandlers

import (
	"fmt"
	"go-multiplayer-quiz-project/models"
	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var (
	livePlayers         = make(map[int][]*websocket.Conn)
	live_mu             sync.RWMutex
	live_broadcastChans = make(map[int]chan models.LobbyMessage)
)

func webSocketLive(context *gin.Context) {
	quizId, err := strconv.Atoi(context.Param("id"))
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "unable to load room"})
		return
	}

	var quizRoom models.QuizRoom
	err = quizRoom.GetQuizRoomFromId(quizId)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Unaable to load room"})
		return
	}

	conn, err := upgrader.Upgrade(context.Writer, context.Request, nil)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to upgrade the connection"})
	}

	_, exists := live_broadcastChans[quizId]
	if !exists { //first one to join
		live_broadcastChans[quizId] = make(chan models.LobbyMessage)
	}

	go livebraodcastAll(quizId)
	go readliveMessages(conn, quizId)

	live_mu.Lock()
	livePlayers[quizId] = append(livePlayers[quizId], conn)
	live_mu.Unlock()
	live_broadcastChans[quizId] <- models.LobbyMessage{Msg: "join", Conn: conn}
}

func livebraodcastAll(quizId int) { // for adding another player and then braodcast updated player list

	for { //broadcast code

		lobbyMessage := <-live_broadcastChans[quizId] //channel to trigger when message receives

		if lobbyMessage.Msg == "leave" {

			for i, c := range livePlayers[quizId] {

				if c == lobbyMessage.Conn {
					live_mu.Lock()
					livePlayers[quizId] = append(livePlayers[quizId][:i], livePlayers[quizId][i+1:]...)
					live_mu.Unlock()
					break
				}
			}

			lobbyMessage.Conn.Close()
		}

		live_mu.RLock()
		conns := append([]*websocket.Conn{}, livePlayers[quizId]...)
		live_mu.RUnlock()

		for _, connection := range conns { // per room
			err := connection.WriteJSON(gin.H{"type": lobbyMessage.Msg, "players": livePlayers[quizId]})
			if err != nil {
				fmt.Println("websocket write error", err)
				connection.Close()
			}
		}
	}
}

func readliveMessages(conn *websocket.Conn, quizId int) { // to read messages from the frontend

	for { // per connection
		_, msg, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Connection is closed", err)
			//conn.Close()
			return
		}
		lobbyMessage := models.LobbyMessage{Msg: string(msg), Conn: conn} //sending correct connection
		live_broadcastChans[quizId] <- lobbyMessage                       //triggers broadcast channel
	}
}
