package models

import (
	"encoding/json"
	"go-multiplayer-quiz-project/database"
)

type QuizRoom struct {
	QuizRoomId int64
	Players    []Player
	TimerTime  int
	QuizTopic  string
}

func GetQuizRoomsFromDB() ([]QuizRoom, error) {

	var q []QuizRoom

	query := `	SELECT * FROM quizrooms	`

	rows, err := database.DB.Query(query)

	if err != nil {
		return q, err
	}

	defer rows.Close()

	var quizRoom QuizRoom
	var playersData string
	var playersList []Player
	for rows.Next() {

		err = rows.Scan(&quizRoom.QuizRoomId, &playersData, &quizRoom.TimerTime, &quizRoom.QuizTopic)

		if err != nil {
			return q, err
		}

		err = json.Unmarshal([]byte(playersData), &playersList)

		if err != nil {
			return q, err
		}

		quizRoom.Players = playersList

		q = append(q, quizRoom)
	}

	return q, err
}

func (quizRoom QuizRoom) SaveQuizRoomToDB() error {

	query := `	INSERT INTO quizrooms( players, timertime, quiztopic) 
			VALUES (?,?,?)	`

	stmt, err := database.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	playersJson, err := json.Marshal(quizRoom.Players)
	if err != nil {
		return err
	}

	result, err := stmt.Exec(playersJson, quizRoom.TimerTime, quizRoom.QuizTopic)

	if err != nil {
		return err
	}

	quizRoomId, err := result.LastInsertId()

	if err != nil {
		return err
	}

	quizRoom.QuizRoomId = quizRoomId
	//fmt.Print(quizRoom.QuizTopic)
	return err
}

func (player Player) AddPlayerToQuiz() {

}
