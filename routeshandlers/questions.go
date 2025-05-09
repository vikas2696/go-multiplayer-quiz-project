package routeshandlers

import (
	"go-multiplayer-quiz-project/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func loadQuestions(context *gin.Context) {

	questions, err := models.GetQuestionsFromJSON("database/science.json")

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message": "Questions not found"})
		return
	}

	context.JSON(http.StatusOK, questions)
}
