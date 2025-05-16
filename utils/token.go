package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const secretKey = "secretkey"

func GetSessionToken(userId int64, username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  userId,
		"username": username,
		"exp":      time.Now().Add(time.Hour * 2).Unix(),
	})

	return token.SignedString([]byte(secretKey))
}

func ValidateToken(token string) error {
	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC) //double check
		if !ok {
			return "", errors.New("invalid Token: Unauthorized access")
		}

		return []byte(secretKey), nil
	})

	if err != nil {
		return errors.New("invalid Token: Unauthorized access " + err.Error())
	}

	validToken := parsedToken.Valid
	if !validToken {
		return errors.New("invalid Token: Unauthorized access")
	}

	return err
}
