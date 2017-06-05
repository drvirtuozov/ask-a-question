package main

import (
	"github.com/graphql-go/graphql"
)

var GraphQLTokenResult = NewGraphQLResult("token", "TokenResult", graphql.String)
var GraphQLQuestionResult = NewGraphQLResult("question", "QuestionResult", GraphQLQuestion)
var GraphQLQuestionsResult = NewGraphQLResult("questions", "QuestionsResult", graphql.NewList(GraphQLQuestion))
var GraphQLAnswerResult = NewGraphQLResult("answer", "AnswerResult", GraphQLAnswer)
var GraphQLAnswersResult = NewGraphQLResult("answers", "AnswersResult", graphql.NewList(GraphQLAnswer))
var GraphQLBooleanResult = NewGraphQLResult("ok", "BooleanResult", graphql.Boolean)
var GraphQLCommentResult = NewGraphQLResult("comment", "CommentResult", GraphQLComment)
var GraphQLUserResult = NewGraphQLResult("user", "UserResult", GraphQLUser)

func NewGraphQLResult(key string, name string, gqlType graphql.Output) *graphql.Object {
	return graphql.NewObject(graphql.ObjectConfig{
		Name: name,
		Fields: graphql.Fields{
			key: &graphql.Field{
				Type: gqlType,
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return p.Source.(map[string]interface{})[key], nil
				},
			},
			"errors": &graphql.Field{
				Type: graphql.NewList(GraphQLError),
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return p.Source.(map[string]interface{})["errors"], nil
				},
			},
		},
	})
}
