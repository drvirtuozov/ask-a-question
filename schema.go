package main

import (
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/graphql-go/graphql"
)

func newSchema() *graphql.Schema {
	schema, err := graphql.NewSchema(graphql.SchemaConfig{
		Query: graphql.NewObject(graphql.ObjectConfig{
			Name:        "Query",
			Description: "This is a root query",
			Fields: graphql.Fields{
				"getUser": &graphql.Field{
					Type: GraphQLUser,
					Args: graphql.FieldConfigArgument{
						"username": &graphql.ArgumentConfig{
							Type: graphql.NewNonNull(graphql.String),
						},
					},
					Resolve: func(p graphql.ResolveParams) (interface{}, error) {
						user := &models.User{}
						err := DB.Find(user, "username = ?", p.Args["username"]).Error

						if err != nil {
							return nil, err
						}

						return user, nil
					},
				},
				"getQuestions": &graphql.Field{
					Type: graphql.NewList(GraphQLQuestion),
					Resolve: func(p graphql.ResolveParams) (interface{}, error) {
						questions := []*models.UserQuestion{}
						err := DB.Find(&questions, "user_id = ?", 2).Error

						if err != nil {
							return nil, err
						}

						return questions, nil
					},
				},
			},
		}),
	})

	if err != nil {
		panic(err)
	}

	return &schema
}
