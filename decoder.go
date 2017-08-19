package main

import (
	"errors"
	"net/http"
	"net/url"
	"reflect"
	"strconv"
	"strings"

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
		if err := r.ParseForm(); err != nil {
			return err
		}

		err = decodeForm(r.Form, v)
	default:
		err = errors.New("set 'Content-Type' header")
	}

	return err
}

func decodeForm(form url.Values, dst interface{}) error {
	t := reflect.TypeOf(dst).Elem()
	v := reflect.ValueOf(dst).Elem()

	if v.Kind() == reflect.Struct {
		for i := 0; i < v.NumField(); i++ {
			tf := t.Field(i)
			vf := v.Field(i)
			tag := tf.Tag.Get("form")

			switch vf.Interface().(type) {
			case int:
				i, err := strconv.Atoi(form.Get(tag))

				if err != nil {
					return errors.New("non integer value in int type")
				}

				vf.SetInt(int64(i))
			case []int:
				sarr := strings.Split(form.Get(tag), ",")
				var iarr []int

				for _, v := range sarr {
					i, err := strconv.Atoi(v)

					if err != nil {
						return errors.New("non integer value in []int")
					}

					iarr = append(iarr, i)
				}

				vf.Set(reflect.ValueOf(iarr))
			case string:
				vf.SetString(form.Get(tag))
			case []string:
				vf.Set(reflect.ValueOf(strings.Split(form.Get(tag), ",")))
			}
		}

		return nil
	}

	return errors.New("destination must be a struct")
}
