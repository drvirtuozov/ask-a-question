package main

import (
	"github.com/graphql-go/graphql"
)

var GraphQLQuestion = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Question",
	Description: "This represents a Question",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*UserQuestion).ID, nil
			},
		},
		"text": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*UserQuestion).Text, nil
			},
		},
		"from": &graphql.Field{
			Type: GraphQLUser,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				from := &User{}
				err := db.Model(p.Source).Related(from, "FromId").Error

				if err != nil {
					return nil, nil
				}

				return from, nil
			},
		},
		"timestamp": &graphql.Field{
			Type: graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*UserQuestion).CreatedAt.Unix(), nil
			},
		},
	},
})
