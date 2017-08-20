package main

import (
	"errors"
	"fmt"
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
			formVal := form.Get(tag)

			switch vf.Interface().(type) {
			case int:
				if len(formVal) == 0 {
					vf.SetInt(0)
					continue
				}

				i, err := strconv.Atoi(formVal)

				if err != nil {
					return fmt.Errorf("non integer value in %s", tag)
				}

				vf.SetInt(int64(i))
			case []int:
				if len(formVal) == 0 {
					vf.Set(reflect.ValueOf([]int{}))
					continue
				}

				sarr := strings.Split(formVal, ",")
				var iarr []int

				for _, v := range sarr {
					i, err := strconv.Atoi(v)

					if err != nil {
						return fmt.Errorf("non integer value in %s", tag)
					}

					iarr = append(iarr, i)
				}

				vf.Set(reflect.ValueOf(iarr))
			case string:
				vf.SetString(formVal)
			case []string:
				if len(formVal) == 0 {
					vf.Set(reflect.ValueOf([]string{}))
					continue
				}

				vf.Set(reflect.ValueOf(strings.Split(formVal, ",")))
			default:
				return fmt.Errorf("decoder's handler of type %s isn't implemented yet", reflect.TypeOf(vf.Interface()))
			}
		}

		return nil
	}

	return errors.New("destination must be a struct")
}
