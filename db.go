package main

import (
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB

func init() {
	db, err := gorm.Open("postgres",
		"postgres://rvuzfjit:SFyVOqvQA7ih4ey00VhPpsuVuVAo0G7G@horton.elephantsql.com:5432/rvuzfjit")

	if err != nil {
		panic(err)
	}

	defer db.Close()
	DB = db
	db.AutoMigrate(&models.User{})
	db.Create(&models.User{
		Username:  "drvirtuozov",
		Password:  "7321",
		Email:     "dr.virtuozov@ya.ru",
		FirstName: "",
	})
	db.Create(&models.User{
		Username: "drvirtuozov2",
		Password: "7321",
		//Email: "dr.virtuozov@ya.ru",
	})
}
