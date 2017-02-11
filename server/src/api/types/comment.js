import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } from 'graphql';
import GraphQLUser from './user';


const GraphQLComment = new GraphQLObjectType({
  name: 'Comment',
  description: 'This represents a Comment',
  fields() {
    return {
      id: {
        type: GraphQLInt,
        resolve(comment) {
          return comment.id;
        }
      },
      text: {
        type: GraphQLString,
        resolve(comment) {
          return comment.text;
        }
      },
      user: {
        type: GraphQLUser,
        resolve(comment) {
          return comment.getUser();
        }
      },
      timestamp: {
        type: GraphQLFloat,
        resolve(comment) {
          return new Date(comment.created_at).getTime();
        }
      }
    };
  }
});

export default GraphQLComment;