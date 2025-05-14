package models

import (
	"go-multiplayer-quiz-project/database"
)

type User struct {
	UserId   int64
	Username string
	Password string
}

func (user *User) SaveUserToDB() error {
	userQuery := " INSERT INTO users( username, password ) VALUES (?,?) "

	stmt, err := database.DB.Prepare(userQuery)
	if err != nil {
		return err
	}

	defer stmt.Close()

	result, err := stmt.Exec(user.Username, user.Password)
	if err != nil {
		return err
	}

	userId, err := result.LastInsertId()
	if err != nil {
		return err
	}
	user.UserId = userId

	playerQuery := " INSERT INTO players( playerid, username ) VALUES (?,?) "

	player_stmt, err := database.DB.Prepare(playerQuery)
	if err != nil {
		return err
	}

	defer player_stmt.Close()

	_, err = player_stmt.Exec(userId, user.Username)
	if err != nil {
		return err
	}

	return err
}
