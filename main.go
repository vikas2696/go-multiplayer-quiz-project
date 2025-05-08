package main

import (
	"go-multiplayer-quiz-project/database"
	"go-multiplayer-quiz-project/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {

	database.InitDB()
	server := gin.Default()

	server.GET("/quizrooms", showAllQuizRooms)
	server.POST("/create-quizroom", createQuizRoom)
	server.PATCH("/quizrooms/:id", joinQuizRoom)

	err := server.Run("localhost:8080")

	if err != nil {
		panic("Cannot start server: " + err.Error())
	}
}

func showAllQuizRooms(context *gin.Context) {

	quizRooms, err := models.GetQuizRoomsFromDB()

	if err != nil {
		context.String(500, "Internal Server Error: Could not fetch QuizRooms")
		return
	}

	context.JSON(200, quizRooms)

}

func createQuizRoom(context *gin.Context) {
	var quizRoom models.QuizRoom
	err := context.ShouldBindJSON(&quizRoom)

	if err != nil {
		context.String(400, "Bad Request"+err.Error())
		return
	}

	err = quizRoom.SaveQuizRoomToDB()
	if err != nil {
		context.String(400, "Bad Request"+err.Error())
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

}
