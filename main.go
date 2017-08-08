package main

import (
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("Server is listening to localhost:3001")
	http.ListenAndServe(":3001", r)
}
