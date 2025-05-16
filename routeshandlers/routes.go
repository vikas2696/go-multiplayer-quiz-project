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

		QuizRoomAuthRoutes := AuthOnlyRoutes.Group("/quizrooms/:id", middleware.QuizJoinMiddleware)
		{
			QuizRoomAuthRoutes.PATCH("/join", joinQuizRoom)
			QuizRoomAuthRoutes.PATCH("/leave", leaveQuizRoom)
			QuizRoomAuthRoutes.GET("/lobby", lobby)
			QuizRoomAuthRoutes.GET("/:ques_id", loadQuestion)
			QuizRoomAuthRoutes.POST("/:ques_id", enterAnswer)
			QuizRoomAuthRoutes.GET("/:ques_id/answer", showAnswer)
		}

	}

}
