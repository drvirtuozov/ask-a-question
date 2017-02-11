import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';


const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a User',
  fields() {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id;
        }
      },
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

export default GraphQLUser;