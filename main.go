package main

import (
	"go-multiplayer-quiz-project/database"
	"go-multiplayer-quiz-project/routeshandlers"

	"github.com/gin-gonic/gin"
)

func main() {

	database.InitDB()
	server := gin.Default()

	routeshandlers.RunRoutes(server)

	server.Run("localhost:8080")
}
