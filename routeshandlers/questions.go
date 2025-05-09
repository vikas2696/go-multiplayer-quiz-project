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

	question := models.GetQuestionFromId(questions, ques_id)

	context.JSON(http.StatusOK, question)
}

func checkAnswer(context *gin.Context) {

	var userAnswer map[string]string
	err := context.ShouldBindJSON(&userAnswer)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"Message": "Answer format wrong"})
		return
	}

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

	question := models.GetQuestionFromId(questions, ques_id)

	if userAnswer["myAnswer"] == question.Answer {
		context.JSON(http.StatusOK, gin.H{
			"Your Answer":    userAnswer["myAnswer"],
			"Correct Answer": question.Answer,
			"Result":         "Correct Answer"})
	} else {
		context.JSON(http.StatusOK, gin.H{
			"Your Answer":    userAnswer["myAnswer"],
			"Correct Answer": question.Answer,
			"Result":         "Incorrect Answer"})
	}

}
