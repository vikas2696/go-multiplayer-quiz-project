package routeshandlers

import "github.com/gin-gonic/gin"

func RunRoutes(server *gin.Engine) {

	server.GET("/quizrooms", showAllQuizRooms)
	server.POST("/create-quizroom", createQuizRoom)
	server.PATCH("/quizrooms/:id", joinQuizRoom)
	server.GET("/quizrooms/:id/:ques_id", loadQuestion)
	server.POST("/quizrooms/:id/:ques_id", checkAnswer)
	server.GET("/quizrooms/:id/lobby", lobby)
}
