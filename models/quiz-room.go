package models

type QuizRoom struct {
	QuizRoomId int64
	Players    []Player
	TimerTime  int
	QuizTopic  string
}

type QuizRooms []QuizRoom

func (quizRooms QuizRooms) ShowAllQuizRooms() {

}

func (quizRoom QuizRoom) CreateQuizRoom() {

}

func (player Player) AddPlayerToQuiz() {

}
