const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = require('graphql');
const GraphQLTokenResult = require( '../results/token');
const User = require( '../../../models/user');
const { wrongPassword, userNotFound } = require( '../../../errors/api');


const GraphQLTokenMutations = new GraphQLObjectType({
  name: 'TokenMutations',
  description: 'Token mutations',
  fields: {
    create: {
      description: 'Creates a new token',
      type: GraphQLTokenResult,
      args: {
        username: {
          type: new GraphQLNonNull(GraphQLString)
        },
        password: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(_, { username, password }) {
        let user = await User.findOne({ where: { username }}),
          token = null,
          errors = [];

        if (user) {
          if (User.comparePasswords(password, user.password)) {
            token = User.sign(user);
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
    }
  }
});

module.exports = GraphQLTokenMutations;
