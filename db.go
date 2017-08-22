package main

import (
	"database/sql"
	"errors"
	"time"

	"github.com/lib/pq"
)

var db *sql.DB

func init() {
	conn, err := sql.Open("postgres",
		"postgres://rvuzfjit:SFyVOqvQA7ih4ey00VhPpsuVuVAo0G7G@horton.elephantsql.com:5432/rvuzfjit")

	if err != nil {
		panic(err)
	}

	db = conn

	/*db.DropTable(
		&User{},
		&UserQuestion{},
		&UserAnswer{},
		&AnswerLike{},
		&AnswerComment{},
	)
	db.AutoMigrate(
		&User{},
		&UserQuestion{},
		&UserAnswer{},
		&AnswerLike{},
		&AnswerComment{},
	)
	db.LogMode(true)
	validations.RegisterCallbacks(db)
	db.Create(&User{
		Username:  "drvirtuozov",
		Password:  "73217321",
		Email:     "dr.virtuozov@ya.ru",
		FirstName: "Vlad",
	})
	db.Create(&User{
		Username:  "boratische",
		Password:  "73217321",
		Email:     "boratische@ya.ru",
		FirstName: "Vlad",
	})*/

	_, err = db.Exec(`
create table if not exists users (
	id serial primary key,
	username text not null unique,
	password text not null,
	first_name text,
	last_name text,
	email text not null unique,
	created_at timestamp default current_timestamp,
	updated_at timestamp,
	deleted_at timestamp
);

create table if not exists questions (
	id serial primary key,
	text text not null,
	user_id integer not null,
	from_id integer default 0,
	answer_id integer default 0,
	created_at timestamp default current_timestamp,
	updated_at timestamp,
	deleted_at timestamp,
	foreign key (user_id) references users (id)
);

create table if not exists answers (
	id serial primary key,
	text text not null,
	user_id integer not null,
	question_id integer not null,
	created_at timestamp default current_timestamp,
	updated_at timestamp,
	deleted_at timestamp,
	foreign key (user_id) references users (id),
	foreign key (question_id) references questions (id)
);
	`)

	if err != nil {
		panic(err)
	}
}

func getUsersByParams(params UsersGetParams) ([]UserResult, error) {
	rows, err := db.Query(`select id, username, first_name, last_name, password from users where id = any($1) or username = any($2)`, pq.Array(params.UserIDs), pq.Array(params.Usernames))

	if err != nil {
		return nil, err
	}

	defer rows.Close()
	var users []UserResult
	var count int

	for rows.Next() {
		count++
		var (
			id        int
			username  string
			firstName sql.NullString
			lastName  sql.NullString
			password  string
		)
		err := rows.Scan(&id, &username, &firstName, &lastName, &password)

		if err != nil {
			return nil, err
		}

		users = append(users, UserResult{
			ID:        uint(id),
			Username:  username,
			FirstName: firstName.String,
			LastName:  lastName.String,
			Password:  password,
		})
	}

	if count == 0 {
		return nil, errors.New("Users not found")
	}

	return users, nil
}

func createUserByParams(params UsersPostParams) (token string, err error) {
	hashedPass, err := hashPassword(params.Password)

	if err != nil {
		return "", err
	}

	var userID int

	err = db.QueryRow("insert into users (username, password, first_name, last_name, email) values ($1, $2, $3, $4, $5) returning id",
		params.Username, hashedPass, params.FirstName, params.LastName, params.Email).Scan(&userID)

	if err != nil {
		return "", err
	}

	return signUser(userID, params.Username)
}

func createTokenByParams(params TokensPostParams) (token string, err error) {
	users, err := getUsersByParams(UsersGetParams{
		Usernames: []string{params.Username},
	})

	if err != nil {
		return "", err
	}

	user := users[0]

	if !compareHashAndPass(user.Password, params.Password) {
		return "", errors.New("Wrong password")
	}

	return signUser(int(user.ID), user.Username)
}

func createQuestionByParams(params QuestionsPostParams) (QuestionResult, error) {
	var (
		id        int
		text      string
		userID    int
		fromID    sql.NullInt64
		createdAt time.Time
	)

	err := db.QueryRow("insert into questions (text, user_id, from_id) values ($1, $2, $3) returning id, text, user_id, from_id, created_at",
		params.Text, params.UserID, params.FromID).Scan(&id, &text, &userID, &fromID, &createdAt)

	if err != nil {
		return QuestionResult{}, err
	}

	return QuestionResult{
		ID:        uint(id),
		Text:      text,
		FromID:    uint(fromID.Int64),
		Timestamp: createdAt.Unix(),
	}, nil
}

func getQuestionsByUserID(id int) ([]QuestionResult, error) {
	rows, err := db.Query("select id, text, from_id, created_at from questions where user_id = $1", id)

	if err != nil {
		return nil, err
	}

	var questions []QuestionResult

	for rows.Next() {
		var (
			id        int
			text      string
			fromID    int
			createdAt time.Time
		)

		err := rows.Scan(&id, &text, &fromID, &createdAt)

		if err != nil {
			return nil, err
		}

		questions = append(questions, QuestionResult{
			ID:        uint(id),
			Text:      text,
			FromID:    uint(fromID),
			Timestamp: createdAt.Unix(),
		})
	}

	return questions, nil
}
