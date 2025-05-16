package routeshandlers

import (
	"go-multiplayer-quiz-project/middleware"

	"github.com/gin-gonic/gin"
)

func RunRoutes(server *gin.Engine) {

	server.POST("/signup", signUp)
	server.POST("/login", logIn)
	server.GET("/quizrooms", showAllQuizRooms)

	AuthOnlyRoutes := server.Group("/", middleware.AuthMiddeleware)
	{
		AuthOnlyRoutes.POST("/create-quizroom", createQuizRoom)
		AuthOnlyRoutes.PATCH("/quizrooms/:id", joinQuizRoom)
		AuthOnlyRoutes.GET("/quizrooms/:id/:ques_id", loadQuestion)
		AuthOnlyRoutes.POST("/quizrooms/:id/:ques_id", enterAnswer)
		AuthOnlyRoutes.GET("/quizrooms/:id/lobby", lobby)
		AuthOnlyRoutes.GET("/quizrooms/:id/:ques_id/answer", showAnswer)

	}

}
