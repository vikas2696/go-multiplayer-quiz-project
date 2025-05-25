package routeshandlers

import (
	"go-multiplayer-quiz-project/middleware"

	"github.com/gin-gonic/gin"
)

func RunRoutes(server *gin.Engine) {

	server.POST("/signup", signUp)
	server.POST("/login", logIn)
	server.GET("/quizrooms", showAllQuizRooms)

	server.GET("/quizrooms/:id/ws/lobby", webSocketLobby)

	AuthOnlyRoutes := server.Group("/", middleware.AuthMiddeleware)
	{
		AuthOnlyRoutes.POST("/create-quizroom", createQuizRoom)
		AuthOnlyRoutes.PATCH("/quizrooms/:id/join", joinQuizRoom)

		QuizRoomAuthRoutes := AuthOnlyRoutes.Group("/quizrooms/:id", middleware.QuizJoinMiddleware)
		{
			QuizRoomAuthRoutes.PATCH("/leave", leaveQuizRoom)
			QuizRoomAuthRoutes.DELETE("/delete", deleteQuizRoom)
			QuizRoomAuthRoutes.GET("/", getQuizRoom)

			//QuizRoomAuthRoutes.GET("/ws/lobby", webSocketLobby)

			QuizRoomAuthRoutes.GET("/get-questions", getAllQuestions)
			QuizRoomAuthRoutes.PATCH("/update-scoresheet", updateScoreSheet)
			QuizRoomAuthRoutes.GET("/get-scoresheet", getScoreSheet)

			QuizRoomAuthRoutes.GET("/:ques_id", loadQuestion)
			QuizRoomAuthRoutes.POST("/:ques_id", enterAnswer)
			QuizRoomAuthRoutes.GET("/:ques_id/answer", showAnswer)
		}

	}

}
