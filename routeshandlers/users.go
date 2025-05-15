package routeshandlers

import (
	"go-multiplayer-quiz-project/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func signUp(context *gin.Context) {

	var user models.User
	err := context.ShouldBindJSON(&user)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"Message1": err.Error()})
		return
	}

	user.Password, err = hashPassword(user.Password)
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

	context.JSON(http.StatusOK, gin.H{"Login Successful": user})

}

func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return "", err
	}

	return string(hashedPassword), err
}
