package routeshandlers

import (
	"go-multiplayer-quiz-project/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func showAllQuizRooms(context *gin.Context) {

	quizRooms, err := models.GetQuizRoomsFromDB()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message": "Quizrooms not found"})
		return
	}

	context.JSON(200, quizRooms)

}

func createQuizRoom(context *gin.Context) {
	var quizRoom models.QuizRoom
	err := context.ShouldBindJSON(&quizRoom)

	if err != nil {
		context.String(400, "Bad Request "+err.Error())
		return
	}

	err = quizRoom.SaveQuizRoomToDB()
	if err != nil {
		context.String(400, "Bad Request "+err.Error())
		return
	}

	context.JSON(201, quizRoom)
}

func joinQuizRoom(context *gin.Context) {

	var player models.Player
	err := context.ShouldBindJSON(&player)

	if err != nil {
		context.String(400, "Bad Request"+err.Error())
	}

	quizId, err := strconv.Atoi(context.Param("id"))

	if err != nil {
		context.String(400, "Bad Request"+err.Error())
	}

	err = player.AddPlayerToQuiz(quizId)

	if err != nil {
		context.String(400, "Bad Request"+err.Error())
	}

	context.JSON(201, player)

}

func lobby(context *gin.Context) {

	quizId, err := strconv.Atoi(context.Param("id"))
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"Message": "Quiz Room not found"})
		return
	}

	var quizRoom models.QuizRoom
	err = quizRoom.GetQuizRoomFromId(quizId)
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"Message": "Quiz Room not found"})
		return
	}

	context.JSON(http.StatusOK, quizRoom)

}
