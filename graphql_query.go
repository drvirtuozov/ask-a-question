package main

import (
	"errors"
	"github.com/dgrijalva/jwt-go"
	"github.com/graphql-go/graphql"
)

var GraphQLQuery = graphql.NewObject(graphql.ObjectConfig{
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
				user := &User{}
				err := db.Find(user, "username = ?", p.Args["username"]).Error

				if err != nil {
					return nil, err
				}

				return user, nil
			},
		},
		"getQuestions": &graphql.Field{
			Type: graphql.NewList(GraphQLQuestion),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				user := p.Context.Value("user")

				if user == nil {
					return nil, errors.New("Token not provided")
				}

				id := user.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				questions := []*UserQuestion{}
				err := db.Order("id desc").Find(&questions, "user_id = ?", id).Error

				if err != nil {
					return nil, err
				}

				return questions, nil
			},
		},
		"getAnswers": &graphql.Field{
			Type: graphql.NewList(GraphQLAnswer),
			Args: graphql.FieldConfigArgument{
				"user_id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				answers := []*UserAnswer{}
				err := db.Order("id desc").Find(&answers, "user_id = ?", p.Args["user_id"]).Error

				if err != nil {
					return nil, err
				}

				return answers, nil
			},
		},
	},
})
