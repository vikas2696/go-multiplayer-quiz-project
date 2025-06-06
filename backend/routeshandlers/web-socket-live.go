package routeshandlers

import (
	"encoding/json"
	"fmt"
	"go-multiplayer-quiz-project/backend/models"
	"go-multiplayer-quiz-project/backend/utils"
	"log"

	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var (
	livePlayers          = make(map[int][]*websocket.Conn)
	live_mu              sync.RWMutex
	live_broadcastChans  = make(map[int]chan models.LiveMessage)
	questionsPerRoom     = make(map[int][]models.Question)
	current_ques_indices = make(map[int]int)
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

	token := context.Query("token")
	err = utils.ValidateToken(token, context)
	if err != nil {
		context.Writer.WriteHeader(http.StatusUnauthorized)
		context.Writer.Write([]byte("Invalid token"))
		return
	}

	playerId, found := context.Get("userId")
	if !found {
		context.Writer.WriteHeader(http.StatusUnauthorized)
		context.Writer.Write([]byte("player id not found"))
		return
	}

	playerIdInt64, ok := playerId.(int64)
	if !ok {
		log.Println("playerId is not of type int64:", playerId)
		context.Writer.WriteHeader(http.StatusInternalServerError)
		context.Writer.Write([]byte("Invalid player ID type"))
		return
	}

	currentPlayer, err := models.GetPlayerFromId(int(playerIdInt64))
	if err != nil {
		log.Println(err.Error())
		context.Writer.WriteHeader(http.StatusInternalServerError)
		context.Writer.Write([]byte("cannot fetch player info"))
		return
	}

	conn, err := upgrader.Upgrade(context.Writer, context.Request, nil)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to upgrade the connection"})
	}

	_, exists := live_broadcastChans[quizId]
	if !exists { //first one to join
		live_broadcastChans[quizId] = make(chan models.LiveMessage)
		live_mu.Lock()
		current_ques_indices[quizId] = 0
		live_mu.Unlock()
	}

	go livebraodcastAll(quizId)
	go readliveMessages(conn, quizId)

	live_mu.Lock()
	livePlayers[quizId] = append(livePlayers[quizId], conn)
	live_mu.Unlock()
	live_broadcastChans[quizId] <- models.LiveMessage{Type: "join", Msg: currentPlayer, Conn: conn}
}

func livebraodcastAll(quizId int) {

	for { //broadcast code
		liveMessage := <-live_broadcastChans[quizId] //channel to trigger when message receives

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

		clientMsg.Conn = conn

		if clientMsg.Type == "questions" {
			questionsBytes, err := json.Marshal(clientMsg.Msg)
			if err != nil {
				fmt.Println("Wrong message format: ", err)
			}
			var questions []models.Question
			err = json.Unmarshal(questionsBytes, &questions)
			if err != nil {
				fmt.Println("Wrong message format: ", err)
			}
			live_mu.Lock()
			questionsPerRoom[quizId] = questions
			live_mu.Unlock()

			if current_ques_indices[quizId]+1 < len(questionsPerRoom[quizId]) {
				live_broadcastChans[quizId] <- models.LiveMessage{
					Type: "question",
					Msg:  questions[current_ques_indices[quizId]],
					Conn: conn}
			} else {
				live_broadcastChans[quizId] <- models.LiveMessage{
					Type: "end_quiz",
					Msg:  nil,
					Conn: conn}
			}

		} else if clientMsg.Type == "next_question" {
			if current_ques_indices[quizId]+1 < len(questionsPerRoom[quizId]) {
				current_ques_indices[quizId]++
				if current_ques_indices[quizId]+1 == len(questionsPerRoom[quizId]) {
					live_broadcastChans[quizId] <- models.LiveMessage{
						Type: "last_question",
						Msg:  questionsPerRoom[quizId][current_ques_indices[quizId]],
						Conn: conn}
				} else {
					live_broadcastChans[quizId] <- models.LiveMessage{
						Type: "question",
						Msg:  questionsPerRoom[quizId][current_ques_indices[quizId]],
						Conn: conn}
				}
			}

		} else if clientMsg.Type == "get_scorecard" {
			live_broadcastChans[quizId] <- models.LiveMessage{
				Type: "scorecard",
				Msg:  nil,
				Conn: conn}
		} else if clientMsg.Type == "answer" {

		} else {
			live_broadcastChans[quizId] <- clientMsg
		}
	}
}
