package main

import (
	"github.com/graphql-go/graphql"
	"github.com/drvirtuozov/ask-a-question/models"
)

var GraphQLUser *graphql.Object

func init() {
	GraphQLUser = graphql.NewObject(graphql.ObjectConfig{
		Name: "User",
		Description: "This represents a User",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.Int,
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return p.Source.(*models.User).ID, nil
				},
			},
			"username": &graphql.Field{
				Type: graphql.String,
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return p.Source.(*models.User).Username, nil
				},
			},
			"first_name": &graphql.Field{
				Type: graphql.String,
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return p.Source.(*models.User).FirstName, nil
				},
			},
			"last_name": &graphql.Field{
				Type: graphql.String,
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return p.Source.(*models.User).LastName, nil
				},
			},
		},
	})
}
