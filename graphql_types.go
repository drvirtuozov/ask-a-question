package main

import (
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/graphql-go/graphql"
)

var GraphQLUser = graphql.NewObject(graphql.ObjectConfig{
	Name:        "User",
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

var GraphQLQuestion = graphql.NewObject(graphql.ObjectConfig{
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
			Type: GraphQLUser,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				from := &models.User{}
				err := DB.Model(p.Source).Related(from, "FromId").Error

				if err != nil {
					return nil, err
				}

				return from, nil
			},
		},
		"timestamp": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*models.UserQuestion).CreatedAt, nil
			},
		},
	},
})
