package routeshandlers

import "github.com/gin-gonic/gin"

func RunRoutes(server *gin.Engine) {

	server.GET("/quizrooms", showAllQuizRooms)
	server.POST("/create-quizroom", createQuizRoom)
	server.PATCH("/quizrooms/:id", joinQuizRoom)
	server.GET("/quizrooms/:id/questions", loadQuestions)

}
