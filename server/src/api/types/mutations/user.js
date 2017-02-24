import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import GraphQLTokenResult from '../results/token';
import User from '../../../models/user';


const GraphQLUserMutations = new GraphQLObjectType({
  name: 'UserMutations',
  description: 'User mutations',
  fields: {
    create: {
      description: 'Creates a new user',
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
      async resolve(_, args) {
        let token = null,
          errors = [];  

        try {
          let user = await User.create(args);              
          token = User.sign(user);
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
    }
  }
});

export default GraphQLUserMutations;