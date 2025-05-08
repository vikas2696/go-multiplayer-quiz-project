package models

import "go-multiplayer-quiz-project/database"

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
	for rows.Next() {
		var quizroom QuizRoom
		err = rows.Scan(&quizroom.QuizRoomId, &quizroom.Players, &quizroom.TimerTime, &quizroom.QuizTopic)

		if err != nil {
			return q, err
		}

		q = append(q, quizRoom)
	}

	return q, err
}

func (quizRoom QuizRoom) SaveQuizRoomToDB() error {

	query := `	INSERT INTO quizrooms( players, timetime, quiztopic) 
			VALUES (?,?,?)	`

	stmt, err := database.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	result, err := stmt.Exec(quizRoom.Players, quizRoom.TimerTime, quizRoom.QuizTopic)

	if err != nil {
		return err
	}

	quizRoomId, err := result.LastInsertId()

	if err != nil {
		return err
	}

	quizRoom.QuizRoomId = quizRoomId
	return err
}

func (player Player) AddPlayerToQuiz() {

}
