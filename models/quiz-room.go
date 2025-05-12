package models

import (
	"encoding/json"
	"errors"
	"go-multiplayer-quiz-project/database"
)

type QuizRoom struct {
	QuizRoomId int64
	Players    []Player
	TimerTime  int
	QuizTopic  string
	IsRunnning bool
	ScoreSheet map[int64]int
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
	var scoresheetData string
	var playersList []Player
	for rows.Next() {

		err = rows.Scan(&quizRoom.QuizRoomId, &playersData, &quizRoom.TimerTime, &quizRoom.QuizTopic, &quizRoom.IsRunnning, &scoresheetData)

		if err != nil {
			return q, err
		}

		err = json.Unmarshal([]byte(playersData), &playersList)

		if err != nil {
			return q, err
		}

		err = json.Unmarshal([]byte(scoresheetData), &quizRoom.ScoreSheet)

		if err != nil {
			return q, err
		}

		quizRoom.Players = playersList

		q = append(q, quizRoom)
	}

	return q, err
}

func (quizRoom QuizRoom) SaveQuizRoomToDB() error {

	query := `	INSERT INTO quizrooms( players, timertime, quiztopic, isrunning, scoresheet) 
			VALUES (?,?,?,?,?)	`

	stmt, err := database.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	playersJson, err := json.Marshal(quizRoom.Players)
	if err != nil {
		return err
	}

	hostPlayerId := quizRoom.Players[0].PlayerId
	quizRoom.ScoreSheet[hostPlayerId] = 0

	scoreSheetJson, err := json.Marshal(quizRoom.ScoreSheet)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(playersJson, quizRoom.TimerTime, quizRoom.QuizTopic, quizRoom.IsRunnning, scoreSheetJson)

	if err != nil {
		return err
	}

	return err
}

func (q *QuizRoom) GetQuizRoomFromId(quizId int) error {

	query := `	SELECT * FROM quizrooms WHERE quizroomid = ?  `

	rows := database.DB.QueryRow(query, quizId)

	var playersData string
	var scoresheetData string

	err := rows.Scan(&q.QuizRoomId, &playersData, &q.TimerTime, &q.QuizTopic, &q.IsRunnning, &scoresheetData)
	if err != nil {
		return errors.New("unable to scan rows")
	}

	err = json.Unmarshal([]byte(playersData), &q.Players)
	if err != nil {
		return errors.New("unable to UnMarshal players")
	}

	err = json.Unmarshal([]byte(scoresheetData), &q.ScoreSheet)
	if err != nil {
		return errors.New("unable to unmarshal scoresheet")
	}

	return err
}

func UpdateRoomStatus(quizRoomId int64) error {

	query := "	UPDATE quizrooms SET isrunning = ? WHERE quizroomid = ?	"

	_, err := database.DB.Exec(query, true, quizRoomId)
	if err != nil {
		return err
	}

	return err

}

func AddPlayerToScoreSheet(quizRoomId int, playerId int64, scoreSheet map[int64]int) error {

	query := "	UPDATE quizrooms SET scoresheet = ? WHERE quizroomid = ?  "

	scoreSheet[playerId] = 0

	scoreSheetData, err := json.Marshal(scoreSheet)
	if err != nil {
		return err
	}

	_, err = database.DB.Exec(query, scoreSheetData, quizRoomId)
	if err != nil {
		return err
	}

	return err

}
