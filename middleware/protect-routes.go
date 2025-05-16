package middleware

import (
	"go-multiplayer-quiz-project/utils"

	"github.com/gin-gonic/gin"
)

func AuthMiddeleware(context *gin.Context) {
	token := context.Request.Header.Get("Authorization")
	if token == "" {
		context.AbortWithStatusJSON(400, gin.H{"No token found": "Authorization failed"})
		return
	}

	err := utils.ValidateToken(token)
	if err != nil {
		context.AbortWithStatusJSON(400, gin.H{"Invalid token": "Authorization failed"})
		return
	}

}
