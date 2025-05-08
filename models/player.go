package models

import (
	"encoding/json"
	"go-multiplayer-quiz-project/database"
)

type Player struct {
	PlayerId int64
	Username string
}

func getPlayersList(quizId int) ([]Player, error) {

	var players []Player
	var dataString string

	query := "SELECT players FROM quizrooms WHERE quizroomid = ?"
	rows, err := database.DB.Query(query, quizId)

	if err != nil {
		return players, err
	}

	defer rows.Close()

	if rows.Next() {
		err = rows.Scan(&dataString)
		if err != nil {
			return players, err
		}
	}

	err = json.Unmarshal([]byte(dataString), &players)

	if err != nil {
		return players, err
	}

	return players, err

}

func (player Player) AddPlayerToQuiz(quizId int) error {
	query := `	UPDATE quizrooms 
				SET  players = ?
				WHERE quizroomid = ?	`

	players, err := getPlayersList(quizId)
	if err != nil {
		return err
	}

	players = append(players, player)

	playersJson, err := json.Marshal(players)
	if err != nil {
		return err
	}

	_, err = database.DB.Exec(query, playersJson, quizId)

	if err != nil {
		return err
	}

	return err
}
