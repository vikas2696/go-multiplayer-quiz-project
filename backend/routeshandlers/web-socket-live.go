package routeshandlers

import (
	"encoding/json"
	"fmt"
	"go-multiplayer-quiz-project/backend/models"

	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var (
	livePlayers         = make(map[int][]*websocket.Conn)
	live_mu             sync.RWMutex
	live_broadcastChans = make(map[int]chan models.LiveMessage)
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
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to load room"})
		return
	}

	// playerId, found := context.Get("userId")
	// if !found {

	// 	context.JSON(http.StatusUnauthorized, gin.H{"error": "Unable to authenticate"})
	// 	return
	// }
	// currentPlayer, err := models.GetPlayerFromId(playerId.(int))
	// if err != nil {
	// 	context.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to authenticate"})
	// 	return
	// }

	conn, err := upgrader.Upgrade(context.Writer, context.Request, nil)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to upgrade the connection"})
	}

	_, exists := live_broadcastChans[quizId]
	if !exists { //first one to join
		live_broadcastChans[quizId] = make(chan models.LiveMessage)
	}

	go livebraodcastAll(quizId)
	go readliveMessages(conn, quizId)

	live_mu.Lock()
	livePlayers[quizId] = append(livePlayers[quizId], conn)
	live_mu.Unlock()
	live_broadcastChans[quizId] <- models.LiveMessage{Type: "join", Msg: models.Player{PlayerId: 1, Username: "test"}, Conn: conn}
}

func livebraodcastAll(quizId int) { // for adding another player and then braodcast updated player list

	for { //broadcast code

		liveMessage := <-live_broadcastChans[quizId] //channel to trigger when message receives

		if liveMessage.Type == "leave" {

			for i, c := range livePlayers[quizId] {

				if c == liveMessage.Conn {
					live_mu.Lock()
					livePlayers[quizId] = append(livePlayers[quizId][:i], livePlayers[quizId][i+1:]...)
					live_mu.Unlock()
					break
				}
			}

			liveMessage.Conn.Close()
		}

		live_mu.RLock()
		conns := append([]*websocket.Conn{}, livePlayers[quizId]...)
		live_mu.RUnlock()

		for _, connection := range conns { // per room
			err := connection.WriteJSON(liveMessage)
			if err != nil {
				fmt.Println("websocket write error", err)
				connection.Close()
			}
		}
	}
}

func readliveMessages(conn *websocket.Conn, quizId int) { // to read messages from the frontend

	var clientMsg models.LiveMessage
	for { // per connection
		_, clientMsgJSON, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Connection is closed", err)
			//conn.Close()
			return
		}

		err = json.Unmarshal(clientMsgJSON, &clientMsg)
		if err != nil {
			fmt.Println("Wrong message format: ", err)
		}

		//liveMessage := models.LiveMessage{Msg: clientMsg.Msg, Conn: conn} //sending correct connection
		clientMsg.Conn = conn
		live_broadcastChans[quizId] <- clientMsg //triggers broadcast channel
	}
}
