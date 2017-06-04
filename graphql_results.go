package main

import (
	"fmt"
	"github.com/graphql-go/graphql"
	"strings"
)

var GraphQLTokenResult = NewGraphQLResult("token", graphql.String)
var GraphQLQuestionResult = NewGraphQLResult("question", GraphQLQuestion)

func NewGraphQLResult(key string, gqltype graphql.Output) *graphql.Object {
	return graphql.NewObject(graphql.ObjectConfig{
		Name: fmt.Sprintf("%sResult", strings.ToUpper(string(key[0])) + key[1:]),
		Fields: graphql.Fields{
			key: &graphql.Field{
				Type: gqltype,
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
