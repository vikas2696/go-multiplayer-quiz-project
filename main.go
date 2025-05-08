package main

import (
	"go-multiplayer-quiz-project/database"
	"go-multiplayer-quiz-project/models"

	"github.com/gin-gonic/gin"
)

func main() {

	database.InitDB()
	server := gin.Default()

	server.GET("/", showAllQuizRooms)
	server.PUT("/create-quiz-room", CreateQuizRoom)

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

func CreateQuizRoom(context *gin.Context) {
	var quizRoom models.QuizRoom
	err := context.ShouldBindJSON(&quizRoom)

	if err != nil {
		context.String(400, "Bad Request")
		return
	}

	quizRoom.SaveQuizRoomToDB()

	context.JSON(201, quizRoom)
}
