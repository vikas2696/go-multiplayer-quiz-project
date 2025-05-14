package routeshandlers

import (
	"go-multiplayer-quiz-project/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func signUp(context *gin.Context) {

	var user models.User
	err := context.ShouldBindJSON(&user)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message1": err.Error()})
		return
	}

	err = user.SaveUserToDB()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message2": err.Error()})
		return
	}

	context.JSON(http.StatusCreated, gin.H{"User created with user Id": user.UserId})

}

func logIn(context *gin.Context) {

	var user models.User
	err := context.ShouldBindJSON(&user)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message1": err.Error()})
		return
	}

	err = user.ValidateLogin()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message1": err.Error()})
		return
	}

	context.JSON(http.StatusInternalServerError, gin.H{"Login Successful": user})

}
