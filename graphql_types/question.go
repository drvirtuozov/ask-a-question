package graphql_types

import (
	"github.com/drvirtuozov/ask-a-question/db"
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/graphql-go/graphql"
)

var Question = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Question",
	Description: "This represents a Question",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*models.UserQuestion).ID, nil
			},
		},
		"text": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*models.UserQuestion).Text, nil
			},
		},
		"from": &graphql.Field{
			Type: User,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				from := &models.User{}
				err := db.Conn.Model(p.Source).Related(from, "FromId").Error

				if err != nil {
					return nil, nil
				}

				return from, nil
			},
		},
		"timestamp": &graphql.Field{
			Type: graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*models.UserQuestion).CreatedAt.Unix(), nil
			},
		},
	},
})
