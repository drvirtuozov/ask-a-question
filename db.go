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

create table if not exists comments (
	id serial primary key,
	text text not null,
	answer_id integer not null,
	user_id integer not null,
	created_at timestamp default current_timestamp,
	updated_at timestamp,
	deleted_at timestamp,
	foreign key (answer_id) references answers (id),
	foreign key (user_id) references users (id)
);

create table if not exists likes (
	id serial primary key,
	user_id integer not null,
	answer_id integer not null,
	created_at timestamp default current_timestamp,
	updated_at timestamp,
	deleted_at timestamp,
	foreign key (user_id) references users (id),
	foreign key (answer_id) references answers (id)
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
		var user UserResult
		err := rows.Scan(&user.ID, &user.Username, &user.FirstName, &user.LastName, &user.Password)

		if err != nil {
			return nil, err
		}

		users = append(users, user)
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
	var question QuestionResult
	var createdAt time.Time

	err := db.QueryRow("insert into questions (text, user_id, from_id) values ($1, $2, $3) returning id, text, from_id, created_at",
		params.Text, params.UserID, params.FromID).Scan(&question.ID, &question.Text, &question.FromID, &createdAt)

	if err != nil {
		return question, err
	}

	question.Timestamp = createdAt.Unix()
	return question, nil
}

func getQuestionsByUserID(id int) ([]QuestionResult, error) {
	rows, err := db.Query("select id, text, from_id, created_at from questions where user_id = $1 and answer_id = 0 and deleted_at is null order by id desc", id)

	if err != nil {
		return nil, err
	}

	var questions []QuestionResult

	for rows.Next() {
		var question QuestionResult
		var createdAt time.Time
		err := rows.Scan(&question.ID, &question.Text, &question.FromID, &createdAt)

		if err != nil {
			return nil, err
		}

		question.Timestamp = createdAt.Unix()
		questions = append(questions, question)
	}

	return questions, nil
}

func deleteQuestionByID(id int, userID int) error {
	res, err := db.Exec("update questions set deleted_at = current_timestamp where id = $1 and user_id = $2",
		id, userID)

	if err != nil {
		return err
	}

	rowsCount, err := res.RowsAffected()

	if err != nil {
		return err
	}

	if rowsCount == 0 {
		return errors.New("Question not found")
	}

	return nil
}

func undeleteQuestionByID(id int, userID int) error {
	res, err := db.Exec("update questions set deleted_at = null where id = $1 and user_id = $2",
		id, userID)

	if err != nil {
		return err
	}

	rowsCount, err := res.RowsAffected()

	if err != nil {
		return err
	}

	if rowsCount == 0 {
		return errors.New("Question not found")
	}

	return nil
}

func createAnswerByParams(params AnswersPostParams) (AnswerResult, error) {
	var answer AnswerResult
	var createdAt time.Time

	tx, err := db.Begin()

	if err != nil {
		return answer, err
	}

	{
		stmt, err := tx.Prepare("insert into answers (text, user_id, question_id) select $1, user_id, id from questions where id = $2 and answer_id = 0 and deleted_at is null returning id, text, user_id, question_id, created_at")

		if err != nil {
			return answer, err
		}

		defer stmt.Close()
		err = stmt.QueryRow(params.Text, params.QuestionID).Scan(&answer.ID, &answer.Text, &answer.UserID, &answer.QuestionID, &createdAt)

		if err != nil {
			tx.Rollback()
			return answer, errors.New("Question not found")
		}
	}

	{
		stmt, err := tx.Prepare("update questions set answer_id = $1 where id = $2")

		if err != nil {
			return answer, err
		}

		defer stmt.Close()
		_, err = stmt.Exec(answer.ID, answer.QuestionID)

		if err != nil {
			tx.Rollback()
			return AnswerResult{}, err
		}
	}

	tx.Commit()
	answer.Timestamp = createdAt.Unix()
	return answer, nil
}

func getAnswersByUserID(id int) ([]AnswerResult, error) {
	rows, err := db.Query("select id, text, user_id, question_id, created_at from answers where user_id = $1 order by id desc", id)

	if err != nil {
		return nil, errors.New("User not found")
	}

	var answers []AnswerResult

	for rows.Next() {
		var answer AnswerResult
		var createdAt time.Time
		err := rows.Scan(&answer.ID, &answer.Text, &answer.UserID, &answer.QuestionID, &createdAt)

		if err != nil {
			return nil, err
		}

		answer.Timestamp = createdAt.Unix()
		answers = append(answers, answer)
	}

	return answers, nil
}

func createCommentByParams(params CommentsPostParams) (CommentResult, error) {
	var comment CommentResult
	var createdAt time.Time

	err := db.QueryRow("insert into comments (answer_id, user_id, text) values ($1, $2, $3) returning id, text, user_id, created_at",
		params.AnswerID, params.UserID, params.Text).Scan(&comment.ID, &comment.Text, &comment.UserID, &createdAt)

	if err != nil {
		return comment, err
	}

	comment.Timestamp = createdAt.Unix()
	return comment, nil
}

func getCommentsByAnswerID(id int) ([]CommentResult, error) {
	var comments []CommentResult

	rows, err := db.Query("select id, text, user_id, created_at from comments where answer_id = $1", id)

	if err != nil {
		return nil, err
	}

	var count int

	for rows.Next() {
		count++
		var comment CommentResult
		var createdAt time.Time
		err := rows.Scan(&comment.ID, &comment.Text, &comment.UserID, &createdAt)

		if err != nil {
			return nil, err
		}

		comment.Timestamp = createdAt.Unix()
		comments = append(comments, comment)
	}

	if count == 0 {
		return nil, errors.New("Answer not found")
	}

	return comments, nil
}

func createLikeByParams(params LikesPostParams) (LikesResult, error) {
	var likes LikesResult
	_, err := db.Exec("insert into likes (answer_id, user_id) select $1, $2 where not exists (select id from likes where answer_id = $1)", params.AnswerID, params.UserID)

	if err != nil {
		return likes, errors.New("Answer not found")
	}

	var count int
	err = db.QueryRow("select count(id) from likes where answer_id = $1", params.AnswerID).Scan(&count)

	if err != nil {
		return likes, err
	}

	likes.Count = count
	return likes, nil
}
