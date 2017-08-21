package main

import (
	"database/sql"
	"errors"

	"github.com/lib/pq"
	//"github.com/qor/validations"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
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
drop table users;
create table users (
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
	`)

	if err != nil {
		panic(err)
	}
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

func createUserByParams(params UsersPostParams) (token string, err error) {
	hashedPass, err := bcrypt.GenerateFromPassword([]byte(params.Password), 8)

	if err != nil {
		return "", err
	}

	var userID int

	err = db.QueryRow("insert into users (username, password, email) values ($1, $2, $3) returning id", params.Username, string(hashedPass), params.Email).Scan(&userID)

	if err != nil {
		return "", err
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":       userID,
		"username": params.Username,
	})

	token, err = jwtToken.SignedString([]byte("secret"))

	if err != nil {
		return "", err
	}

	return token, nil
}
