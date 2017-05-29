package graphql_types

import (
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
					return nil, nil
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
					return nil, nil
				}

				return question, nil
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
