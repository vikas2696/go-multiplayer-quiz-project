package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.Default()

	err := server.Run("localhost:8080")

	if err != nil {
		panic("Cannot start server: " + err.Error())
	}
}
