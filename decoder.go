package main

import (
	"errors"
	"net/http"

	"github.com/ajg/form"
	"github.com/go-chi/render"
)

func customDecoder(r *http.Request, v interface{}) error {
	var err error

	switch render.GetRequestContentType(r) {
	case render.ContentTypeJSON:
		err = render.DecodeJSON(r.Body, v)
	case render.ContentTypeXML:
		err = render.DecodeXML(r.Body, v)
	case render.ContentTypeForm:
		err = decodeForm(r, v)
	default:
		err = errors.New("set 'Content-Type' header")
	}

	return err
}

func decodeForm(r *http.Request, v interface{}) error {
	var err error

	if err := r.ParseForm(); err != nil {
		return err
	}

	err = form.DecodeValues(v, r.Form)
	return err
}
