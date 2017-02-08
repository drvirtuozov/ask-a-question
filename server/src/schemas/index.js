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
      addUser: {
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
      addQuestion: {
        type: QuestionSchema,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          },
          text: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, args) {
          let { username } = args,
            Instance = await User.findOne({ where: { username }});

          return Instance.createQuestion(args);
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