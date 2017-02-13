import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import GraphQLToken from './token';
import GraphQLUser from './user';
import GraphQLQuestion from './question';
import GraphQLAnswer from './answer';
import GraphQLComment from './comment';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { tokenNotProvided, wrongPassword, userNotFound, wrongQuestionId, answerNotFound } from '../../errors/api';
import User from '../../models/user';
import UserQuestion from '../../models/user_question';
import UserAnswer from '../../models/user_answer';


const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to create stuff',
  fields() {
    return {
      token: {
        type: GraphQLToken,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, { username, password }) {
          let user = await User.findOne({ where: { username }});

          if (!user) throw userNotFound;

          if (user.password === password) {
            return jwt.sign({ id: user.id }, config.jwtSecret);
          } else {
            throw wrongPassword;
          }
        }
      },
      user: {
        type: GraphQLToken,
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
          let user = await User.create(args);
          return jwt.sign({ id: user.id }, config.jwtSecret);
        }
      },
      question: {
        type: GraphQLQuestion,
        args: {
          user_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          text: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, { user_id, text }, ctx) {
          let user = await User.findById(user_id);

          if (!user) throw userNotFound;

          if (ctx.user) {
            let askingUser = await User.findById(ctx.user.id),
              question = await user.createQuestion({ text }); 
            return question.setFrom(askingUser);             
          } else {
            return user.createQuestion({ text });
          }
        }
      },
      answer: {
        type: GraphQLAnswer,
        args: {
          question_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          text: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, { question_id, text }, ctx) {
          if (!ctx.user) throw tokenNotProvided;
          
          let user = await User.findById(ctx.user.id),
            question = await UserQuestion.findById(question_id);

          if (!question) throw wrongQuestionId; 

          let answer = await question.createAnswer({ text, user_id: user.id });
          answer.setQuestion(question);
          return answer;
        }
      },
      comment: {
        type: GraphQLComment,
        args: {
          answer_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          text: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, { answer_id, text }, ctx) {
          let answer = await UserAnswer.findById(answer_id);

          if (!answer) throw answerNotFound;

          if (ctx.user) {
            let user = await User.findById(ctx.user.id),
              comment = await answer.createComment({ text });

            return comment.setUser(user);
          } else {
            return answer.createComment({ text });
          }
        }
      },
      like : {
        type: GraphQLAnswer,
        args: {
          answer_id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        async resolve(root, { answer_id }, ctx) {
          if (!ctx.user) throw tokenNotProvided;

          let user = await User.findById(ctx.user.id),
            answer = await UserAnswer.findById(answer_id);

          if (!answer) throw answerNotFound;

          let like = await answer.createLike();
          like.setUser(user);
          return answer;
        }
      }
    };
  }
});

export default GraphQLMutation;