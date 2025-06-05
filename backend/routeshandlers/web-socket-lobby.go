package routeshandlers

import (
	"fmt"
	"go-multiplayer-quiz-project/backend/models"

	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var (
	joinedPlayers  = make(map[int][]*websocket.Conn)
	mu             sync.RWMutex
	broadcastChans = make(map[int]chan models.LobbyMessage)
)

func webSocketLobby(context *gin.Context) {
	quizId, err := strconv.Atoi(context.Param("id"))
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid quizroom"})
		return
	}

	var quizRoom models.QuizRoom
	err = quizRoom.GetQuizRoomFromId(quizId)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	conn, err := upgrader.Upgrade(context.Writer, context.Request, nil)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to upgrade the connection"})
		return
	}

	_, exists := broadcastChans[quizId]
	if !exists { //host creates the room and joins and starts both goroutines which will forever listens for other players to join and update the player list
		broadcastChans[quizId] = make(chan models.LobbyMessage)
	}

	go braodcastAll(quizId)
	go readMessages(conn, quizId)

	mu.Lock()
	joinedPlayers[quizId] = append(joinedPlayers[quizId], conn)
	mu.Unlock()
	broadcastChans[quizId] <- models.LobbyMessage{Msg: "join", Conn: conn}
}

func braodcastAll(quizId int) { // for adding another player and then braodcast updated player list

	for { //broadcast code

		lobbyMessage := <-broadcastChans[quizId] //channel to trigger when message receives

		if lobbyMessage.Msg == "leave" {

			for i, c := range joinedPlayers[quizId] {

				if c == lobbyMessage.Conn {
					mu.Lock()
					joinedPlayers[quizId] = append(joinedPlayers[quizId][:i], joinedPlayers[quizId][i+1:]...)
					mu.Unlock()
					break
				}
			}

			lobbyMessage.Conn.Close()
		}

		mu.RLock()
		conns := append([]*websocket.Conn{}, joinedPlayers[quizId]...)
		mu.RUnlock()

		for _, connection := range conns { // per room
			err := connection.WriteJSON(gin.H{"type": lobbyMessage.Msg, "players": joinedPlayers[quizId]})
			if err != nil {
				fmt.Println("websocket write error", err)
				connection.Close()
			}
		}
	}
}

func readMessages(conn *websocket.Conn, quizId int) { // to read messages from the frontend

	for { // per connection
		_, msg, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Connection is closed", err)
			//conn.Close()
			return
		}
		lobbyMessage := models.LobbyMessage{Msg: string(msg), Conn: conn} //sending correct connection
		broadcastChans[quizId] <- lobbyMessage                            //triggers broadcast channel
	}
}
