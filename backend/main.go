package main

import (
	"go-multiplayer-quiz-project/database"
	"go-multiplayer-quiz-project/routeshandlers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	database.InitDB()
	server := gin.Default()

	// CORS middleware
	server.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Your React app URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	routeshandlers.RunRoutes(server)

	server.Run("localhost:8080")

}
