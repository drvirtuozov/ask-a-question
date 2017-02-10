import { GraphQLObjectType, GraphQLString } from 'graphql';


const GraphQLToken = new GraphQLObjectType({
  name: 'Token',
  description: 'This represents a Token',
  fields() {
    return {
      token: {
        type: GraphQLString,
        resolve(token) {
          return token;
        }
      }
    };
  }
});

export default GraphQLToken;