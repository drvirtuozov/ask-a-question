package main

import (
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/qor/validations"
)

var DB *gorm.DB

func init() {
	db, err := gorm.Open("postgres",
		"postgres://rvuzfjit:SFyVOqvQA7ih4ey00VhPpsuVuVAo0G7G@horton.elephantsql.com:5432/rvuzfjit")

	if err != nil {
		panic(err)
	}

	DB = db
	db.AutoMigrate(&models.User{}, &models.UserQuestion{}, &models.UserAnswer{})
	db.LogMode(true)
	validations.RegisterCallbacks(db)
	db.Create(&models.User{
		Username:  "drvirtuozov",
		Password:  "73217321",
		Email:     "dr.virtuozov@ya.ru",
		FirstName: "Vlad",
	})
	db.Create(&models.User{
		Username:  "boratische",
		Password:  "73217321",
		Email:     "boratische@ya.ru",
		FirstName: "Vlad",
	})
}
