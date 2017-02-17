import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { tokenNotProvided, wrongPassword, userNotFound, questionNotFound, answerNotFound } from '../../errors/api';
import User from '../../models/user';
import UserQuestion from '../../models/user_question';
import UserAnswer from '../../models/user_answer';
import bcrypt from 'bcryptjs';
import GraphQLTokenResult from './results/token';
import GraphQLQuestionResult from './results/question';
import GraphQLAnswerResult from './results/answer';
import GraphQLCommentResult from './results/comment';


const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to create stuff',
  fields() {
    return {
      token: {
        type: GraphQLTokenResult,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, { username, password }) {
          let user = await User.findOne({ where: { username }}),
            token = null,
            errors = [];

          if (user) {
            if (bcrypt.compareSync(password, user.password)) {
              token = jwt.sign({ id: user.id }, config.jwtSecret);
            } else {
              errors.push(wrongPassword({ field: 'password' }));
            }
          } else {
            errors.push(userNotFound({ field: 'username' }));
          }

          return {
            token,
            errors: errors.length ? errors : null
          };
        }
      },
      user: {
        type: GraphQLTokenResult,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, args) {
          let token = null,
            errors = [];  

          try {
            let user = await User.create(args);              
            token = jwt.sign({ id: user.id }, config.jwtSecret);
          } catch (e) {
            if (e.errors) {
              e.errors.forEach(err => {
                errors.push({
                  field: err.path,
                  status: 400,
                  title: 'Bad Request',
                  detail: err.message
                });
              });
            }
          }

          return {
            token,
            errors: errors.length ? errors : null
          };
        }
      },
      question: {
        type: GraphQLQuestionResult,
        args: {
          user_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          text: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, { user_id, text }, ctx) {
          let user = await User.findById(user_id),
            question = null,
            errors = [];

          if (user) {
            if (ctx.user) {
              let askingUser = await User.findById(ctx.user.id);
              question = await user.createQuestion({ text }); 
              await question.setFrom(askingUser);             
            } else {
              question = await user.createQuestion({ text });
            }
          } else {
            errors.push(userNotFound({ field: 'user_id' }));
          }

          return {
            question,
            errors: errors.length ? errors : null
          };
        }
      },
      answer: {
        type: GraphQLAnswerResult,
        args: {
          question_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          text: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, { question_id, text }, ctx) {
          let answer = null,
            errors = [];

          if (ctx.user) {
            let user = await User.findById(ctx.user.id),
              question = await UserQuestion.findById(question_id);

            if (question) {
              answer = await question.createAnswer({ text, user_id: user.id });
              await answer.setQuestion(question);
            } else {
              errors.push(questionNotFound({ field: 'question_id' })); 
            }
          } else {
            errors.push(tokenNotProvided());
          }

          return {
            answer,
            errors: errors.length ? errors : null
          };
        }
      },
      comment: {
        type: GraphQLCommentResult,
        args: {
          answer_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          text: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, { answer_id, text }, ctx) {
          let answer = await UserAnswer.findById(answer_id),
            comment = null,
            errors = [];

          if (answer) {
            if (ctx.user) {
              let user = await User.findById(ctx.user.id);
              comment = await answer.createComment({ text });
              await comment.setUser(user);
            } else {
              comment = await answer.createComment({ text });
            }
          } else {
            errors.push(answerNotFound({ field: 'answer_id' }));
          }

          return {
            comment,
            errors: errors.length ? errors : null
          };
        }
      },
      like: {
        type: GraphQLAnswerResult,
        args: {
          answer_id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        async resolve(root, { answer_id }, ctx) {
          if (ctx.user) {
            var user = await User.findById(ctx.user.id),
              answer = await UserAnswer.findById(answer_id),
              errors = [];

            if (answer) {
              let like = await answer.createLike();
              await like.setUser(user);
            } else {
              errors.push(answerNotFound({ field: 'answer_id' }));
            }
          } else {
            errors.push(tokenNotProvided());
          }

          return {
            answer,
            errors: errors.length ? errors : null
          };
        }
      }
    };
  }
});

export default GraphQLMutation;