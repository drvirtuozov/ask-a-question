package graphql_types

import (
	"fmt"
	"github.com/drvirtuozov/ask-a-question/db"
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/graphql-go/graphql"
)

var Answer = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Answer",
	Description: "This represents an Answer",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*models.UserAnswer).ID, nil
			},
		},
		"text": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*models.UserAnswer).Text, nil
			},
		},
		"user": &graphql.Field{
			Type: User,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				user := &models.User{}
				err := db.Conn.Model(p.Source).Related(user).Error

				if err != nil {
					return nil, err
				}

				return user, nil
			},
		},
		"question": &graphql.Field{
			Type: Question,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				question := &models.UserQuestion{}
				err := db.Conn.Model(p.Source).Related(question).Error

				if err != nil {
					return nil, err
				}

				return question, nil
			},
		},
		"comments": &graphql.Field{
			Type: graphql.NewList(Comment),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				comments := []*models.AnswerComment{}
				err := db.Conn.Model(p.Source).Related(&comments).Error

				if err != nil {
					return nil, err
				}

				return comments, nil
			},
		},
		"likes": &graphql.Field{
			Type: graphql.NewList(User),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				likes := []*models.AnswerLike{}
				err := db.Conn.Model(p.Source).Related(&likes).Error

				if err != nil {
					return nil, err
				}

				if len(likes) != 0 {
					users := []*models.User{}
					query := fmt.Sprintf("id = %d", likes[0].UserId)

					for i := 1; i < len(likes); i++ {
						query += fmt.Sprintf(" OR id = %d", likes[i].UserId)
					}

					err = db.Conn.Find(&users, query).Error

					if err != nil {
						return nil, err
					}

					return users, nil
				}

				return nil, nil
			},
		},
		"timestamp": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*models.UserAnswer).CreatedAt, nil // change to unix timestamp later
			},
		},
	},
})
