package routeshandlers

import (
	"go-multiplayer-quiz-project/models"
	"go-multiplayer-quiz-project/utils"
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

	user.Password, err = utils.HashPassword(user.Password)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message2": err.Error()})
		return
	}

	err = user.SaveUserToDB()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message3": err.Error()})
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
		context.JSON(http.StatusInternalServerError, gin.H{"Message2": err.Error()})
		return
	}

	token, err := utils.GetSessionToken(user.UserId, user.Username)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message2": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"Login Successful with session token ": token})

}
