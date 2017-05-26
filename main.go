package main

import (
	"net/http"
	"fmt"
	"github.com/graphql-go/handler"
)

func main() {
	http.Handle("/api", handler.New(&handler.Config{
		Schema: newSchema(),
		Pretty: true,
	}))

	fmt.Println("Server is listening to localhost:3001")
	http.ListenAndServe(":3001", nil)
}