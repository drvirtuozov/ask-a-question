import { 
  GraphQLObjectType, GraphQLSchema, GraphQLList, 
  GraphQLString, GraphQLNonNull 
} from 'graphql';
import User from '../models/user';
import UserSchema from './user';
import QuestionSchema from './question';
import AnswerSchema from './answer';
import { 
  createUser, findAllUsers, findQuestionsByUsername, 
  findAnswersByUsername, addQuestion 
} from '../helpers/dbmanager';


const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields() {
    return {
      getUsers: {
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
      getQuestions: {
        type: new GraphQLList(QuestionSchema),
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, args) {
          let Instance = await User.findOne({ where: args });

          return Instance.getQuestions();
        }
      },
      getAnswers: {
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
      createUser: {
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
      createQuestion: {
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
      createAnswer: {
        type: AnswerSchema,
        args: {
          question_id: {
            type: new GraphQLNonNull(GraphQLString)
          },
          text: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, { username, text }, ctx) {
          let Instance = await User.findOne({ where: { username: ctx.user.username }});
          return Instance.createQuestion({ text });
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