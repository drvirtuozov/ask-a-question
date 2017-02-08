import { GraphQLObjectType, GraphQLString } from 'graphql';


const UserSchema = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a User',
  fields: () => {
    return {
      username: {
        type: GraphQLString,
        resolve(user) {
          return user.username;
        }
      },
      first_name: {
        type: GraphQLString,
        resolve(user) {
          return user.first_name;
        }
      },
      last_name: {
        type: GraphQLString,
        resolve(user) {
          return user.last_name;
        }
      }
    };
  }
});

export default UserSchema;