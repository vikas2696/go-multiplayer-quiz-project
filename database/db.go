package database

import (
	"database/sql"

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
		players TEXT,
		timertime INTEGER NOT NULL,
		quiztopic TEXT NOT NULL,
		scoresheet TEXT NOT NULL
		)`

	_, err := DB.Exec(quizRoomQuery)

	if err != nil {
		panic("Unable to initialize quiz room table" + err.Error())
	}

	playerQuery := `
		CREATE TABLE IF NOT EXISTS players (
		playerid INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL
		)`

	_, err = DB.Exec(playerQuery)
	if err != nil {
		panic("Unable to initialize player table" + err.Error())
	}
}
