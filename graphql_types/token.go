package graphql_types

import "github.com/graphql-go/graphql"

var Token = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Token",
	Description: "This represents a Token",
	Fields: graphql.Fields{
		"token": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source, nil
			},
		},
	},
})
