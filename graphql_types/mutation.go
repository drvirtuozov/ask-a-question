package graphql_types

import (
	"errors"
	"github.com/dgrijalva/jwt-go"
	"github.com/drvirtuozov/ask-a-question/db"
	"github.com/drvirtuozov/ask-a-question/models"
	"github.com/graphql-go/graphql"
)

var Mutation = graphql.NewObject(graphql.ObjectConfig{
	Name:        "Mutation",
	Description: "This is a root mutation",
	Fields: graphql.Fields{
		"createUser": &graphql.Field{
			Type: Token,
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
				user := &models.User{
					Username: p.Args["username"].(string),
					Email:    p.Args["email"].(string),
					Password: p.Args["password"].(string),
				}

				err := db.Conn.Create(user).Error

				if err != nil {
					return nil, err
				}

				token, err := user.Sign()

				if err != nil {
					return nil, err
				}

				return token, nil
			},
		},
		"createToken": &graphql.Field{
			Type: Token,
			Args: graphql.FieldConfigArgument{
				"username": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"password": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				user := &models.User{}
				err := db.Conn.Find(user, "username = ?", p.Args["username"]).Error

				if err != nil {
					return nil, err
				}

				if !user.ComparePassword(p.Args["password"].(string)) {
					return nil, errors.New("Wrong password")
				}

				token, err := user.Sign()

				if err != nil {
					return nil, err
				}

				return token, nil
			},
		},
		"createQuestion": &graphql.Field{
			Type: Question,
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
				user := &models.User{}
				err := db.Conn.Find(user, "id = ?", p.Args["user_id"]).Error

				if err != nil {
					return nil, err
				}

				if value := p.Context.Value("user"); value != nil {
					fromId = uint(value.(*jwt.Token).Claims.(jwt.MapClaims)["id"].(float64))
				}

				question := &models.UserQuestion{
					Text:   p.Args["text"].(string),
					FromId: fromId,
				}

				err = db.Conn.Model(user).Association("UserQuestions").Append(question).Error

				if err != nil {
					return nil, err
				}

				return question, nil
			},
		},
		"answerQuestion": &graphql.Field{
			Type: Answer,
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
					return nil, errors.New("Token not provided")
				}

				userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				question := &models.UserQuestion{}
				err := db.Conn.Find(question, "id = ?", p.Args["question_id"]).Error

				if err != nil {
					return nil, err
				}

				user := &models.User{}
				err = db.Conn.Find(user, "id = ?", userId).Error

				if err != nil {
					return nil, err
				}

				answer := &models.UserAnswer{
					Text:           p.Args["text"].(string),
					UserQuestionId: question.ID,
				}

				err = db.Conn.Model(user).Association("UserAnswers").Append(answer).Error

				if err != nil {
					return nil, err
				}

				question.UserAnswerId = answer.ID
				db.Conn.Save(question)
				return answer, nil
			},
		},
		"deleteQuestion": &graphql.Field{
			Type: graphql.Boolean,
			Args: graphql.FieldConfigArgument{
				"question_id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				ctxUser := p.Context.Value("user")

				if ctxUser == nil {
					return false, errors.New("Token not provided")
				}

				userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				err := db.Conn.Where("id = ? AND user_id = ?", p.Args["question_id"], userId).Delete(&models.UserQuestion{}).Error

				if err != nil {
					return false, errors.New("Record not found")
				}

				return true, nil
			},
		},
		"restoreQuestion": &graphql.Field{
			Type: graphql.Boolean,
			Args: graphql.FieldConfigArgument{
				"question_id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				ctxUser := p.Context.Value("user")

				if ctxUser == nil {
					return false, errors.New("Token not provided")
				}

				userId := ctxUser.(*jwt.Token).Claims.(jwt.MapClaims)["id"]
				err := db.Conn.Model(&models.UserQuestion{}).Unscoped().Where("id = ? AND user_id = ?", p.Args["question_id"], userId).Update("deleted_at", nil).Error

				if err != nil {
					return false, errors.New("Record not found")
				}

				return true, nil
			},
		},
	},
})
