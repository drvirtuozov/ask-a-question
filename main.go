package main

import (
	"fmt"
	"github.com/auth0/go-jwt-middleware"
	"github.com/dgrijalva/jwt-go"
	"github.com/graphql-go/handler"
	"github.com/mnmtanish/go-graphiql"
	"net/http"
)

func main() {
	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			return []byte("secret"), nil
		},
		SigningMethod:       jwt.SigningMethodHS256,
		CredentialsOptional: true,
	})

	graphqlHandler := handler.New(&handler.Config{
		Schema: GraphQLSchema,
		Pretty: true,
	})

	graphqlContextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		graphqlHandler.ContextHandler(r.Context(), w, r)
	})

	http.Handle("/api", jwtMiddleware.Handler(graphqlContextHandler))
	http.HandleFunc("/graphql", graphiql.ServeGraphiQL)
	fmt.Println("Server is listening to localhost:3001")
	http.ListenAndServe(":3001", nil)
}
