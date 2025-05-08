package database

import (
	"database/sql"
	"go-multiplayer-quiz-project/models"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB
var err error

func InitDB() {

	DB, err = sql.Open("sqlite3", "api.db")

	if err != nil {
		panic("Cannot connect to the database: " + err.Error())
	}

	DB.SetMaxOpenConns(10)
	DB.SetMaxIdleConns(5)
	createTables()
}

func createTables() {

	quizRoomQuery := `
		CREATE TABLE IF NOT EXISTS quizrooms (
		quizroomid INTEGER PRIMARY KEY AUTOINCREMENT,
		players TEXT NOT NULL,
		timertime INTEGER NOT NULL,
		quiztopic TEXT NOT NULL
		)`

	_, err := DB.Exec(quizRoomQuery)

	if err != nil {
		log.Fatal("Unable to initialize table" + err.Error())
	}

	playerQuery := `
		CREATE TABLE IF NOT EXISTS players (
		playerid INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL
		)`

	_, err = DB.Exec(playerQuery)
	if err != nil {
		log.Fatal("Unable to initialize table" + err.Error())
	}
}

func GetQuizRoomsFromDB() (q []models.QuizRoom) {

	query := `	SELECT * FROM quizrooms	`

	rows, err := DB.Query(query)

	if err != nil {
		panic("Unable to fetch Quiz Rooms: " + err.Error())
	}

	defer rows.Close()

	var quizRoom models.QuizRoom
	for rows.Next() {
		var quizroom models.QuizRoom
		err = rows.Scan(&quizroom.QuizRoomId, &quizroom.Players, &quizroom.TimerTime, &quizroom.QuizTopic)

		if err != nil {
			log.Fatal("Unable to fetch rows: " + err.Error())
		}

		q = append(q, quizRoom)
	}

	return q
}
