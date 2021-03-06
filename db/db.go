package db

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var Conn *sql.DB

func Init() {
	url := os.Getenv("DATABASE_URL")

	if url == "" {
		log.Fatal("$DATABASE_URL must be set")
	}

	conn, err := sql.Open("postgres", url)

	if err != nil {
		log.Fatal(err)
	}

	Conn = conn
}

func Migrate() {
	_, err := Conn.Exec(`
		create table if not exists users (
			id serial primary key,
			username text not null unique,
			password text not null,
			first_name text not null,
			email text not null unique,
			created_at timestamp default current_timestamp,
			updated_at timestamp,
			deleted_at timestamp
		);
		
		create table if not exists questions (
			id serial primary key,
			text text not null,
			user_id integer not null,
			from_id integer default null,
			answer_id integer default null,
			created_at timestamp default current_timestamp,
			deleted_at timestamp,
			foreign key (user_id) references users (id)
		);
		
		create table if not exists answers (
			id serial primary key,
			text text not null,
			user_id integer not null,
			question_id integer not null,
			created_at timestamp default current_timestamp,
			foreign key (user_id) references users (id),
			foreign key (question_id) references questions (id)
		);
		
		create table if not exists comments (
			id serial primary key,
			text text not null,
			answer_id integer not null,
			user_id integer not null,
			from_id integer not null,
			created_at timestamp default current_timestamp,
			updated_at timestamp,
			deleted_at timestamp,
			foreign key (answer_id) references answers (id),
			foreign key (user_id) references users (id),
			foreign key (from_id) references users (id)
		);
		
		create table if not exists likes (
			id serial primary key,
			user_id integer not null,
			answer_id integer not null,
			created_at timestamp default current_timestamp,
			foreign key (user_id) references users (id),
			foreign key (answer_id) references answers (id)
		);
			`)

	if err != nil {
		log.Fatal(err)
	}
}
