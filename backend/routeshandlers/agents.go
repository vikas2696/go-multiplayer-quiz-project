package routeshandlers

import (
	"bytes"
	"encoding/json"
	"go-multiplayer-quiz-project/backend/models"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func handleQuizAgent(context *gin.Context) {

	agent_url := "https://thesurfacequiz-ai-agent.up.railway.app/query"
	contentType := "applicaton/json"
	var client_request models.ClientRequest

	err := context.ShouldBindJSON(&client_request)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "invalid request/body"})
		return
	}

	jsonRequest, err := json.Marshal(client_request)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "marshal error"})
		return
	}

	response, err := http.Post(agent_url, contentType, bytes.NewBuffer(jsonRequest))
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get response"})
		return
	}

	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get response body"})
		return
	}

	err = os.WriteFile("database/agent.json", body, 0644)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create questions file"})
		return
	}

	context.JSON(http.StatusCreated, gin.H{"message": "file created succesfully."})

}
