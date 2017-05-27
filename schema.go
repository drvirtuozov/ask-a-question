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
						res := DB.Find(&models.User{}, "username = ?", p.Args["username"])

						if errs := res.GetErrors(); len(errs) > 0 {
							return nil, errs[0]
						}

						return res.Value, nil
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
