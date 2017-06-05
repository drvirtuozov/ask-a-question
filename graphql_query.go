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
			Type: GraphQLUserResult,
			Args: graphql.FieldConfigArgument{
				"username": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				user := &User{}
				err := db.Find(user, "username = ?", p.Args["username"]).Error

				if err != nil {
					return map[string]interface{}{
						"user":   nil,
						"errors": append([]error{}, errors.New("User not found")),
					}, nil
				}

				return map[string]interface{}{
					"user":   user,
					"errors": nil,
				}, nil
			},
		},
		"getQuestions": &graphql.Field{
			Type: GraphQLQuestionsResult,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				ctxUser := p.Context.Value("user")

				if ctxUser == nil {
					return map[string]interface{}{
						"questions": nil,
						"errors":    append([]error{}, errors.New("Token not provided")),
					}, nil
				}

				userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				user := &User{}
				questions := []*UserQuestion{}
				err := db.Order("id DESC").Find(user, "id = ?", userId).Related(&questions).Error

				if err != nil {
					return map[string]interface{}{
						"questions": nil,
						"errors":    append([]error{}, errors.New("User not found")),
					}, nil
				}

				if len(questions) == 0 {
					return map[string]interface{}{
						"questions": nil,
						"errors":    nil,
					}, nil
				}

				return map[string]interface{}{
					"questions": questions,
					"errors":    nil,
				}, nil
			},
		},
		"getAnswers": &graphql.Field{
			Type: GraphQLAnswersResult,
			Args: graphql.FieldConfigArgument{
				"user_id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				answers := []*UserAnswer{}
				user := &User{}
				err := db.Order("id DESC").Find(user, "id = ?", p.Args["user_id"]).Related(&answers).Error

				if err != nil {
					return map[string]interface{}{
						"answers": nil,
						"errors":  append([]error{}, errors.New("User not found")),
					}, nil
				}

				if len(answers) == 0 {
					return map[string]interface{}{
						"answers": nil,
						"errors":  nil,
					}, nil
				}

				return map[string]interface{}{
					"answers": answers,
					"errors":  nil,
				}, nil
			},
		},
	},
})
