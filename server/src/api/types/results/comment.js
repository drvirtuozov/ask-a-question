import { GraphQLObjectType, GraphQLList } from 'graphql';
import GraphQLError from '../error';
import GraphQLComment from '../comment';


const GraphQLCommentResult = new GraphQLObjectType({
  name: 'CommentResult',
  fields: {
    comment: { 
      type: GraphQLComment
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

export default GraphQLCommentResult;