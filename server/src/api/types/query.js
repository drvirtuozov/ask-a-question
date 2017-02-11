import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql';
import GraphQLUser from './user';
import GraphQLQuestion from './question';
import GraphQLAnswer from './answer';
import { tokenNotProvided } from '../../errors/api';
import User from '../../models/user';


const GraphQLQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields() {
    return {
      users: {
        type: new GraphQLList(GraphQLUser),
        args: {
          username: {
            type: GraphQLString
          }
        },
        resolve(root, args, ctx) {
          return User.findAll({ where: args });
        }
      },
      questions: {
        type: new GraphQLList(GraphQLQuestion),
        async resolve(root, args, ctx) {
          if (!ctx.user) throw tokenNotProvided;

          let user = await User.findOne({ where: { username: ctx.user.username} });
          return user.getQuestions();
        }
      },
      answers: {
        type: new GraphQLList(GraphQLAnswer),
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve(root, args) {
          let user = await User.findOne({ where: args });
          return user.getAnswers();
        }
      }
    };
  }
});

export default GraphQLQuery;