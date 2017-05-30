package graphql_types

import (
	"github.com/drvirtuozov/ask-a-question/db"
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/graphql-go/graphql"
)

var Comment = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Comment",
	Description: "This represents a Comment",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*models.AnswerComment).ID, nil
			},
		},
		"text": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*models.AnswerComment).Text, nil
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
		"timestamp": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*models.UserAnswer).CreatedAt, nil // change to unix timestamp later
			},
		},
	},
})
