package main

import (
	"github.com/graphql-go/graphql"
	"strings"
)

var GraphQLError = graphql.NewObject(graphql.ObjectConfig{
	Name: "Error",
	Fields: graphql.Fields{
		"field": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				text := strings.ToLower(p.Source.(error).Error())
				fields := []string{
					"username", "password", "email",
				}

				for _, v := range fields {
					if strings.Contains(text, v) {
						return v, nil
					}
				}

				return nil, nil
			},
		},
		"message": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(error).Error(), nil
			},
		},
	},
})
