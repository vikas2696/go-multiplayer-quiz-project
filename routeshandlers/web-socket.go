package routeshandlers

import (
	"go-multiplayer-quiz-project/models"
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
	broadcastChans = make(map[int]chan string)
)

func webSocketLobby(context *gin.Context) {
	quizId, err := strconv.Atoi(context.Param("id"))
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	var quizRoom models.QuizRoom
	quizRoom.GetQuizRoomFromId(quizId)

	conn, err := upgrader.Upgrade(context.Writer, context.Request, nil)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	mu.Lock()
	joinedPlayers[quizId] = append(joinedPlayers[quizId], conn)
	_, exists := broadcastChans[quizId]
	if !exists { //means host has joined
		broadcastChans[quizId] = make(chan string)
		go func() {

			for {

				msg := <-broadcastChans[quizId]

				mu.RLock()
				conns := append([]*websocket.Conn{}, joinedPlayers[quizId]...)
				mu.RUnlock()

				for _, connection := range conns {
					connection.WriteJSON(gin.H{"type": msg,
						"players": quizRoom.Players})
				}
			}
		}()
	}
	mu.Unlock()

	go func() {
		for {
			_, msg, err := conn.ReadMessage()
			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
				return
			}
			broadcastChans[quizId] <- string(msg)
		}
	}()

}
