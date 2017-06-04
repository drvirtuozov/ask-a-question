package main

import (
	"errors"
	"github.com/dgrijalva/jwt-go"
	"github.com/graphql-go/graphql"
)

var GraphQLMutation = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Mutation",
	Description: "This is a root mutation",
	Fields: graphql.Fields{
		"createUser": &graphql.Field{
			Type: GraphQLTokenResult,
			Args: graphql.FieldConfigArgument{
				"username": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"email": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"password": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				user := &User{
					Username: p.Args["username"].(string),
					Email:    p.Args["email"].(string),
					Password: p.Args["password"].(string),
				}

				errs := db.Create(user).GetErrors()

				if len(errs) > 0 {
					return map[string]interface{}{
						"token":  nil,
						"errors": errs,
					}, nil
				}

				token, err := user.Sign()

				if err != nil {
					return nil, err
				}

				return map[string]interface{}{
					"token":  token,
					"errors": nil,
				}, nil
			},
		},
		"createToken": &graphql.Field{
			Type: GraphQLTokenResult,
			Args: graphql.FieldConfigArgument{
				"username": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"password": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				user := &User{}
				err := db.Find(user, "username = ?", p.Args["username"]).Error

				if err != nil {
					return map[string]interface{}{
						"token":  nil,
						"errors": append([]error{}, errors.New("Wrong username")),
					}, nil
				}

				if !user.ComparePassword(p.Args["password"].(string)) {
					return map[string]interface{}{
						"token":  nil,
						"errors": append([]error{}, errors.New("Wrong password")),
					}, nil
				}

				token, err := user.Sign()

				if err != nil {
					return nil, err
				}

				return map[string]interface{}{
					"token":  token,
					"errors": nil,
				}, nil
			},
		},
		"createQuestion": &graphql.Field{
			Type: GraphQLQuestionResult,
			Args: graphql.FieldConfigArgument{
				"user_id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
				"text": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				var fromId uint = 0
				user := &User{}
				err := db.Find(user, "id = ?", p.Args["user_id"]).Error

				if err != nil {
					return map[string]interface{}{
						"question": nil,
						"errors":   append([]error{}, errors.New("User not found")),
					}, nil
				}

				if value := p.Context.Value("user"); value != nil {
					fromId = uint(value.(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))
				}

				question := &UserQuestion{
					Text:   p.Args["text"].(string),
					FromId: fromId,
				}

				err = db.Model(user).Association("UserQuestions").Append(question).Error

				if err != nil {
					return nil, err
				}

				return map[string]interface{}{
					"question": question,
					"errors":   nil,
				}, nil
			},
		},
		"answerQuestion": &graphql.Field{
			Type: GraphQLAnswerResult,
			Args: graphql.FieldConfigArgument{
				"question_id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
				"text": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				ctxUser := p.Context.Value("user")

				if ctxUser == nil {
					return map[string]interface{}{
						"answer": nil,
						"errors": append([]error{}, errors.New("Token not provided")),
					}, nil
				}

				userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				question := &UserQuestion{}
				err := db.Find(question, "id = ? AND user_answer_id IS NULL AND user_id = ?", p.Args["question_id"], userId).Error

				if err != nil {
					return map[string]interface{}{
						"answer": nil,
						"errors": append([]error{}, errors.New("Question not found")),
					}, nil
				}

				user := &User{}
				err = db.Find(user, "id = ?", userId).Error

				if err != nil {
					return nil, err
				}

				answer := &UserAnswer{
					Text:           p.Args["text"].(string),
					UserQuestionId: question.ID,
				}

				err = db.Model(user).Association("UserAnswers").Append(answer).Error

				if err != nil {
					return nil, err
				}

				question.UserAnswerId = answer.ID
				db.Save(question)
				return map[string]interface{}{
					"answer": answer,
					"errors": nil,
				}, nil
			},
		},
		"deleteQuestion": &graphql.Field{
			Type: GraphQLBooleanResult,
			Args: graphql.FieldConfigArgument{
				"question_id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				ctxUser := p.Context.Value("user")

				if ctxUser == nil {
					return map[string]interface{}{
						"ok":     false,
						"errors": append([]error{}, errors.New("Token not provided")),
					}, nil
				}

				userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				err := db.Where("id = ? AND user_id = ?", p.Args["question_id"], userId).Delete(&UserQuestion{}).Error

				if err != nil {
					return map[string]interface{}{
						"ok":     false,
						"errors": append([]error{}, errors.New("Question not found")),
					}, nil
				}

				return map[string]interface{}{
					"ok":     true,
					"errors": nil,
				}, nil
			},
		},
		"restoreQuestion": &graphql.Field{
			Type: GraphQLBooleanResult,
			Args: graphql.FieldConfigArgument{
				"question_id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				ctxUser := p.Context.Value("user")

				if ctxUser == nil {
					return map[string]interface{}{
						"ok":     false,
						"errors": append([]error{}, errors.New("Token not provided")),
					}, nil
				}

				userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				err := db.Model(&UserQuestion{}).Unscoped().Where("id = ? AND user_id = ?", p.Args["question_id"], userId).Update("deleted_at", nil).Error

				if err != nil {
					return map[string]interface{}{
						"ok":     false,
						"errors": append([]error{}, errors.New("Question not found")),
					}, nil
				}

				return map[string]interface{}{
					"ok":     true,
					"errors": nil,
				}, nil
			},
		},
		"commentAnswer": &graphql.Field{
			Type: GraphQLComment,
			Args: graphql.FieldConfigArgument{
				"answer_id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
				"text": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				ctxUser := p.Context.Value("user")

				if ctxUser == nil {
					return nil, errors.New("Token not provided")
				}

				userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				comment := &AnswerComment{
					UserId: uint(userId.(float64)),
					Text:   p.Args["text"].(string),
				}

				err := db.Find(&UserAnswer{}, "id = ?", p.Args["answer_id"]).Association("AnswerComments").Append(comment).Error

				if err != nil {
					return nil, errors.New("Record not found")
				}

				return comment, nil
			},
		},
		"likeAnswer": &graphql.Field{
			Type: graphql.Boolean,
			Args: graphql.FieldConfigArgument{
				"answer_id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				ctxUser := p.Context.Value("user")

				if ctxUser == nil {
					return false, errors.New("Token not provided")
				}

				userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				like := &AnswerLike{
					UserId: uint(userId.(float64)),
				}

				err := db.Find(&UserAnswer{}, "id = ?", p.Args["answer_id"]).Association("AnswerLikes").Append(like).Error

				if err != nil {
					return false, errors.New("Record not found")
				}

				return true, nil
			},
		},
		"unlikeAnswer": &graphql.Field{
			Type: graphql.Boolean,
			Args: graphql.FieldConfigArgument{
				"answer_id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				ctxUser := p.Context.Value("user")

				if ctxUser == nil {
					return false, errors.New("Token not provided")
				}

				userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]

				err := db.Delete(&AnswerLike{}, "user_id = ? AND user_answer_id = ?", userId, p.Args["answer_id"]).Error

				if err != nil {
					return false, errors.New("Record not found")
				}

				return true, nil
			},
		},
	},
})
