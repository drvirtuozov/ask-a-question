package main

import (
	"github.com/drvirtuozov/ask-a-question/graphql_types"
	"github.com/graphql-go/graphql"
)

var Schema *graphql.Schema

func init() {
	schema, err := graphql.NewSchema(graphql.SchemaConfig{
		Query: graphql_types.Query,
		Mutation: graphql_types.Mutation,
	})

	if err != nil {
		panic(err)
	}

	Schema = &schema
}
