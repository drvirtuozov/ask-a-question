package graphql_types

import (
	"errors"
	//"github.com/dgrijalva/jwt-go"
	"github.com/dgrijalva/jwt-go"
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
		"createQuestion": &graphql.Field{
			Type: Question,
			Args: graphql.FieldConfigArgument{
				"user_id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
				"text": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				var fromId uint = 0
				user := &models.User{}
				err := db.Conn.Find(user, "id = ?", p.Args["user_id"]).Error

				if err != nil {
					return nil, err
				}

				if value := p.Context.Value("user"); value != nil {
					fromId = uint(value.(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))
				}

				question := &models.UserQuestion{
					Text:   p.Args["text"].(string),
					FromId: fromId,
				}

				err = db.Conn.Model(user).Association("UserQuestions").Append(question).Error

				if err != nil {
					return nil, err
				}

				return question, nil
			},
		},
	},
})
