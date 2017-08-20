package main

import (
	"database/sql"
	"errors"

	"github.com/lib/pq"
	//"github.com/qor/validations"
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
}

func getUsersByParams(params UsersGetParams) ([]UserResult, error) {
	rows, err := db.Query(`select id, username, first_name, last_name from users where id = any($1) or username = any($2)`, pq.Array(params.UserIDs), pq.Array(params.Usernames))

	if err != nil {
		return nil, err
	}

	defer rows.Close()
	var users []UserResult
	var count int

	for rows.Next() {
		count++
		user := UserResult{}
		err := rows.Scan(&user.ID, &user.Username, &user.FirstName, &user.LastName)

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
