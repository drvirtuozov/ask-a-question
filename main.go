package main

import (
	"fmt"
	"github.com/graphql-go/handler"
	"github.com/mnmtanish/go-graphiql"
	"net/http"
)

func main() {
	http.Handle("/api", handler.New(&handler.Config{
		Schema: newSchema(),
		Pretty: true,
	}))

	http.HandleFunc("/graphql", graphiql.ServeGraphiQL)

	fmt.Println("Server is listening to localhost:3001")
	http.ListenAndServe(":3001", nil)
}
