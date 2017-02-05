import { 
  GraphQLObjectType, GraphQLSchema, GraphQLList, 
  GraphQLString, GraphQLNonNull 
} from 'graphql';
import User from './user';
import Question from './question';
import { createUser, findAllUsers, findQuestionsByUsername } from '../helpers/dbmanager';


const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields() {
    return {
      users: {
        type: new GraphQLList(User),
        args: {
          username: {
            type: GraphQLString
          }
        },
        resolve(root, args) {
          return findAllUsers(args);
        }
      },
      questions: {
        type: new GraphQLList(Question),
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, args) {
          return findQuestionsByUsername(args.username);
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
        type: User,
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
          return createUser(args);
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