package graphql_types

import (
	"errors"
	"github.com/drvirtuozov/ask-a-question/db"
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/graphql-go/graphql"
)

var Mutation = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Mutation",
	Description: "This is a root mutation",
	Fields: graphql.Fields{
		"createUser": &graphql.Field{
			Type: Token,
			Args: graphql.FieldConfigArgument{
				"username": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"email": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"password": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				user := &models.User{
					Username: p.Args["username"].(string),
					Email:    p.Args["email"].(string),
					Password: p.Args["password"].(string),
				}

				err := db.Conn.Create(user).Error

				if err != nil {
					return nil, err
				}

				token, err := user.Sign()

				if err != nil {
					return nil, err
				}

				return token, nil
			},
		},
		"createToken": &graphql.Field{
			Type: Token,
			Args: graphql.FieldConfigArgument{
				"username": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"password": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				user := &models.User{}
				err := db.Conn.Find(user, "username = ?", p.Args["username"]).Error

				if err != nil {
					return nil, err
				}

				if !user.ComparePassword(p.Args["password"].(string)) {
					return nil, errors.New("Wrong password")
				}

				token, err := user.Sign()

				if err != nil {
					return nil, err
				}

				return token, nil
			},
		},
	},
})
