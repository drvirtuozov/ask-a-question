package main

import (
	"github.com/graphql-go/graphql"
	"fmt"
)

func newSchema() *graphql.Schema {
	schema, err := graphql.NewSchema(graphql.SchemaConfig{
		Query: graphql.NewObject(graphql.ObjectConfig{
			Name: "RootQuery",
			Description: "This is a root query",
			Fields: graphql.Fields{
				"hello": &graphql.Field{
					Type: graphql.String,
					Args: graphql.FieldConfigArgument{
						"name": &graphql.ArgumentConfig{
							Type: graphql.NewNonNull(graphql.String),
						},
					},
					Resolve: func(p graphql.ResolveParams) (interface{}, error) {
						return fmt.Sprintf("Hello, %s!", p.Args["name"]), nil
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
