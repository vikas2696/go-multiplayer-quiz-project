package models

import (
	"encoding/json"
	"errors"
	"os"
)

type Question struct {
	Ques    string
	OptionA string
	OptionB string
	OptionC string
	OptionD string
	Answer  string
}

func GetQuestionsFromJSON(filename string) ([]Question, error) {

	file, err := os.Open(filename)

	if err != nil {
		return nil, errors.New("unable to open file")
	}

	defer file.Close()

	var questions []Question
	err = json.NewDecoder(file).Decode(&questions)
	if err != nil {
		return nil, errors.New("unable to read file")
	}

	return questions, err
}
