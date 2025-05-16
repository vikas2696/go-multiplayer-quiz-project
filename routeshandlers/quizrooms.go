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

	generatedId, err := quizRoom.SaveQuizRoomToDB()
	if err != nil {
		context.String(400, "Bad Request "+err.Error())
		return
	}

	context.JSON(http.StatusCreated, gin.H{"QuizRoom created with ID": generatedId})
}

func joinQuizRoom(context *gin.Context) {

	var player models.Player
	err := context.ShouldBindJSON(&player)

	if err != nil {
		context.String(400, "Bad Request"+err.Error())
		return
	}

	quizId, err := strconv.Atoi(context.Param("id"))

	if err != nil {
		context.String(400, "Bad Request"+err.Error())
		return
	}

	err = player.AddPlayerToQuiz(quizId)

	if err != nil {
		context.String(400, "Bad Request "+err.Error())
		return
	}

	context.JSON(http.StatusCreated, gin.H{"Player joined Successfully to room " + strconv.Itoa(quizId): player})

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

func leaveQuizRoom(context *gin.Context) {

	var player models.Player
	err := context.ShouldBindJSON(&player)

	if err != nil {
		context.JSON(400, "Bad Request"+err.Error())
		return
	}

	quizId, err := strconv.Atoi(context.Param("id"))

	if err != nil {
		context.JSON(400, "Bad Request"+err.Error())
		return
	}

	err = player.DeletePlayerFromQuiz(quizId)

	if err != nil {
		context.JSON(400, "Bad Request "+err.Error())
		return
	}

	context.JSON(http.StatusCreated, gin.H{"Player left Successfully from room " + strconv.Itoa(quizId): player})

}
