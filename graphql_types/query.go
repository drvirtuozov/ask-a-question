package graphql_types

import (
	"github.com/drvirtuozov/ask-a-question/db"
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/graphql-go/graphql"
)

var Query = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Query",
	Description: "This is a root query",
	Fields: graphql.Fields{
		"getUser": &graphql.Field{
			Type: User,
			Args: graphql.FieldConfigArgument{
				"username": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				user := &models.User{}
				err := db.Conn.Find(user, "username = ?", p.Args["username"]).Error

				if err != nil {
					return nil, err
				}

				return user, nil
			},
		},
		"getQuestions": &graphql.Field{
			Type: graphql.NewList(Question),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				questions := []*models.UserQuestion{}
				err := db.Conn.Find(&questions, "user_id = ?", 2).Error // change to id from context later

				if err != nil {
					return nil, err
				}

				return questions, nil
			},
		},
	},
})
