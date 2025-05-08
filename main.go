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

	err := server.Run("localhost:8080")

	if err != nil {
		panic("Cannot start server: " + err.Error())
	}
}

func showAllQuizRooms(context *gin.Context) {

	var quizRooms []models.QuizRoom
	quizRooms = database.GetQuizRoomsFromDB()

	context.JSON(200, quizRooms)

}
