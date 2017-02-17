import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';


const GraphQLError = new GraphQLObjectType({
  name: 'Error',
  description: 'This represents an Error',
  fields() {
    return {
      field: {
        type: GraphQLString,
        resolve(error) {
          return error.field;
        }
      },
      status: {
        type: GraphQLInt,
        resolve(error) {
          return error.status;
        }
      },
      title: {
        type: GraphQLString,
        resolve(error) {
          return error.title;
        }
      },
      detail: {
        type: GraphQLString,
        resolve(error) {
          return error.detail;
        }
      }
    };
  }
});

export default GraphQLError;