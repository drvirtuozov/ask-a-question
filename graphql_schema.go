package main

import (
	"github.com/graphql-go/graphql"
)

var GraphQLSchema *graphql.Schema

func init() {
	schema, err := graphql.NewSchema(graphql.SchemaConfig{
		Query:    GraphQLQuery,
		Mutation: GraphQLMutation,
	})

	if err != nil {
		panic(err)
	}

	GraphQLSchema = &schema
}
