package routeshandlers

import (
	"go-multiplayer-quiz-project/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var joinedPlayers = make(map[int][]*websocket.Conn)

func webSocketLobby(context *gin.Context) {
	quizId, err := strconv.Atoi(context.Param("id"))
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "could not find the room"})
		return
	}

	var quizRoom models.QuizRoom
	quizRoom.GetQuizRoomFromId(quizId)

	conn, err := upgrader.Upgrade(context.Writer, context.Request, nil)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "could not find the room"})
		return
	}

	joinedPlayers[quizId] = append(joinedPlayers[quizId], conn)

	for _, connection := range joinedPlayers[quizId] {
		connection.WriteJSON(quizRoom.Players)
	}

}
