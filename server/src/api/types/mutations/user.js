const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = require('graphql');
const GraphQLTokenResult = require('../results/token');
const User = require('../../../models/user');


const GraphQLUserMutations = new GraphQLObjectType({
  name: 'UserMutations',
  description: 'User mutations',
  fields: {
    create: {
      description: 'Creates a new user',
      type: GraphQLTokenResult,
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString),
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(_, args) {
        let token = null;
        const errors = [];

        try {
          const user = await User.create(args);
          token = User.sign(user);
        } catch (e) {
          if (e.errors) {
            e.errors.forEach((err) => {
              errors.push({
                field: err.path,
                status: 400,
                title: 'Bad Request',
                detail: err.message,
              });
            });
          }
        }

        return {
          token,
          errors: errors.length ? errors : null,
        };
      },
    },
  },
});

module.exports = GraphQLUserMutations;
