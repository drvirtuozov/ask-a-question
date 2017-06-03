package main

import (
	"github.com/graphql-go/graphql"
)

var GraphQLComment = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Comment",
	Description: "This represents a Comment",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*AnswerComment).ID, nil
			},
		},
		"text": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*AnswerComment).Text, nil
			},
		},
		"user": &graphql.Field{
			Type: GraphQLUser,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				user := &User{}
				err := db.Model(p.Source).Related(user).Error

				if err != nil {
					return nil, err
				}

				return user, nil
			},
		},
		"timestamp": &graphql.Field{
			Type: graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*AnswerComment).CreatedAt.Unix(), nil
			},
		},
	},
})
