import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import GraphQLTokenResult from '../results/token';
import User from '../../../models/user';
import bcrypt from 'bcryptjs';
import { wrongPassword, userNotFound } from '../../../errors/api';


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
      async resolve(root, { username, password }) {
        let user = await User.findOne({ where: { username }}),
          token = null,
          errors = [];

        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            token = jwt.sign({ id: user.id }, config.jwtSecret);
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

export default GraphQLTokenMutations;