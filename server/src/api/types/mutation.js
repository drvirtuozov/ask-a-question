import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import GraphQLToken from './token';
import GraphQLUser from './user';
import GraphQLQuestion from './question';
import GraphQLAnswer from './answer';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { tokenNotProvided, wrongPassword, userNotFound, wrongQuestionId } from '../../errors/api';
import User from '../../models/user';


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
            return jwt.sign({ username }, config.jwtSecret);
          } else {
            throw wrongPassword;
          }
        }
      },
      user: {
        type: GraphQLUser,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          },
          password: {
            type: new GraphQLNonNull(GraphQLString)
          },
          first_name: {
            type: new GraphQLNonNull(GraphQLString)
          },
          last_name: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return User.create(args);
        }
      },
      question: {
        type: GraphQLQuestion,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          text: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, { username, text }, ctx) {
          let user = await User.findOne({ where: { username }});

          if (!user) throw userNotFound;

          if (ctx.user) {
            let askingUser = await User.findOne({ where: { username: ctx.user.username }}),
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

          let user = await User.findOne({ where: { username: ctx.user.username }}),
            question = await UserQuestion.findById(question_id);

          if (!question) throw wrongQuestionId; 

          let answer = await question.createAnswer({ text, user_id: user.id });
          answer.setQuestion(question);
          return answer;
        }
      }
    };
  }
});

export default GraphQLMutation;