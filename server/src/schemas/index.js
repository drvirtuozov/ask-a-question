import { 
  GraphQLObjectType, GraphQLSchema, GraphQLList, 
  GraphQLString, GraphQLNonNull, GraphQLInt
} from 'graphql';
import User from '../models/user';
import UserQuestion from '../models/user_question';
import UserSchema from './user';
import QuestionSchema from './question';
import AnswerSchema from './answer';
import '../helpers/dbmanager';


const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields() {
    return {
      users: {
        type: new GraphQLList(UserSchema),
        args: {
          username: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return User.findAll({ where: args });
        }
      },
      questions: {
        type: new GraphQLList(QuestionSchema),
        async resolve(root, args, ctx) {
          let Instance = await User.findOne({ where: { username: ctx.user.username} });

          return Instance.getQuestions();
        }
      },
      answers: {
        type: new GraphQLList(AnswerSchema),
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, args) {
          let Instance = await User.findOne({ where: args });

          return Instance.getAnswers();
        }
      }
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to create stuff',
  fields() {
    return {
      user: {
        type: UserSchema,
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
        type: QuestionSchema,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          text: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, { username, text }) {
          let Instance = await User.findOne({ where: { username }});
          return Instance.createQuestion({ text });
        }
      },
      answer: {
        type: AnswerSchema,
        args: {
          question_id: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          text: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, { question_id, text }, ctx) {
          let UserInstance = await User.findOne({ where: { username: ctx.user.username }}),
            QuestionInstance = await UserQuestion.findById(question_id),
            AnswerInstance = await QuestionInstance.createAnswer({ text, user_id: UserInstance.id });

          AnswerInstance.setQuestion(QuestionInstance);
          return AnswerInstance;
        }
      }
    };
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;