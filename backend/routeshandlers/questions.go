package routeshandlers

import (
	"go-multiplayer-quiz-project/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func getAllQuestions(context *gin.Context) {

	quizRoomId, err := strconv.Atoi(context.Param("id"))
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message": "Invalid Quiz Room"})
		return
	}

	var quizRoom models.QuizRoom
	err = quizRoom.GetQuizRoomFromId(quizRoomId)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message": "Invalid Quiz Room"})
		return
	}

	questions, err := models.GetQuestionsFromJSON("database/" + quizRoom.QuizTopic + ".json")
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message": "Questions not found"})
		return
	}

	context.JSON(http.StatusOK, questions)
}

func loadQuestion(context *gin.Context) {

	quizRoomId, err := strconv.Atoi(context.Param("id"))
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message": "Invalid Quiz Room"})
		return
	}

	err = models.UpdateRoomStatus(int64(quizRoomId))
	if err != nil {
		context.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	var quizRoom models.QuizRoom
	err = quizRoom.GetQuizRoomFromId(quizRoomId)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message": "Invalid Quiz Room"})
		return
	}

	ques_id, err := strconv.Atoi(context.Param("ques_id"))
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message": "Cannot convert question id"})
		return
	}

	questions, err := models.GetQuestionsFromJSON("database/" + quizRoom.QuizTopic + ".json")
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message": "Questions not found"})
		return
	}

	question, err := models.GetQuestionFromId(questions, ques_id)
	if err != nil {
		context.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	context.JSON(http.StatusOK, question)
}

func showAnswer(context *gin.Context) {

	quizRoomId, err := strconv.Atoi(context.Param("id"))
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"Message": "Cannot find Room"})
		return
	}

	var quizRoom models.QuizRoom
	quizRoom.GetQuizRoomFromId(quizRoomId)

	playersAnswers := quizRoom.PlayersAnswers
	scoreSheet := quizRoom.ScoreSheet

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

	question, err := models.GetQuestionFromId(questions, ques_id)
	if err != nil {
		context.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	for key, value := range playersAnswers {
		if value == question.Answer {
			scoreSheet[key]++
		}
	}

	err = models.UpdateScoreSheetinDB(int64(quizRoomId), scoreSheet)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message": "Unable to update score"})
		return
	}

	context.JSON(http.StatusInternalServerError, scoreSheet)

}

func enterAnswer(context *gin.Context) {

	quizRoomId, err := strconv.Atoi(context.Param("id"))
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Internal Server Error": "Unable to get quiz id"})
		return
	}

	var quizRoom models.QuizRoom
	quizRoom.GetQuizRoomFromId(quizRoomId)

	playersAnswers := quizRoom.PlayersAnswers

	var answerData string
	err = context.ShouldBindJSON(&answerData)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Internal Server Error": "Unable to get input answer"})
		return
	}

	p_id, found := context.Get("userId")
	if !found {
		context.JSON(http.StatusInternalServerError, gin.H{"Internal Server Error": "Unable to authenticate"})
		return
	}

	playersAnswers[p_id.(int64)] = answerData

	err = models.SaveAnswersToDB(playersAnswers, quizRoomId)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Internal Server Error": "Unable to save answer"})
		return
	}

	context.JSON(http.StatusCreated, playersAnswers)
}
