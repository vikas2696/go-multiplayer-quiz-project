package routeshandlers

import (
	"go-multiplayer-quiz-project/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func loadQuestion(context *gin.Context) {

	ques_id, err := strconv.Atoi(context.Param("ques_id"))
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message": "Cannot convert question id"})
		return
	}

	questions, err := models.GetQuestionsFromJSON("database/science.json")

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message": "Questions not found"})
		return
	}

	question := models.GetQuestionFromQid(questions, ques_id)

	context.JSON(http.StatusOK, question)
}
