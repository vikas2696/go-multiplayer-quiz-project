package models

import (
	"errors"
	"go-multiplayer-quiz-project/database"
	"go-multiplayer-quiz-project/utils"
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

func (user *User) ValidateLogin() (err error) {

	query := " SELECT * FROM users WHERE username = ? "

	row := database.DB.QueryRow(query, user.Username)

	var hashedPassword string

	err = row.Scan(&user.UserId, &user.Username, &hashedPassword)
	if err != nil {
		return errors.New("invalid Username/Password")
	}

	match := utils.CheckPassword(hashedPassword, user.Password)

	if !match {
		return errors.New("invalid Username/Password")
	}

	return err
}
