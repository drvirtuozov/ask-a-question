package main

import (
	"fmt"
	"github.com/graphql-go/graphql"
)

var GraphQLAnswer = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Answer",
	Description: "This represents an Answer",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*UserAnswer).ID, nil
			},
		},
		"text": &graphql.Field{
			Type: graphql.String,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*UserAnswer).Text, nil
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
		"question": &graphql.Field{
			Type: GraphQLQuestion,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				question := &UserQuestion{}
				err := db.Model(p.Source).Related(question).Error

				if err != nil {
					return nil, err
				}

				return question, nil
			},
		},
		"comments": &graphql.Field{
			Type: graphql.NewList(GraphQLComment),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				comments := []*AnswerComment{}
				err := db.Model(p.Source).Related(&comments).Error

				if err != nil {
					return nil, err
				}

				return comments, nil
			},
		},
		"likes": &graphql.Field{
			Type: graphql.NewList(GraphQLUser),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				likes := []*AnswerLike{}
				err := db.Model(p.Source).Related(&likes).Error

				if err != nil {
					return nil, err
				}

				if len(likes) != 0 {
					users := []*User{}
					query := fmt.Sprintf("id = %d", likes[0].UserId)

					for i := 1; i < len(likes); i++ {
						query += fmt.Sprintf(" OR id = %d", likes[i].UserId)
					}

					err = db.Find(&users, query).Error

					if err != nil {
						return nil, err
					}

					return users, nil
				}

				return nil, nil
			},
		},
		"timestamp": &graphql.Field{
			Type: graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return p.Source.(*UserAnswer).CreatedAt.Unix(), nil
			},
		},
	},
})
