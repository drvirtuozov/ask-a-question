import { GraphQLObjectType, GraphQLList } from 'graphql';
import GraphQLError from '../error';
import GraphQLComment from '../comment';


const GraphQLCommentsResult = new GraphQLObjectType({
  name: 'CommentsResult',
  fields: {
    comments: { 
      type: new GraphQLList(GraphQLComment)
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

export default GraphQLCommentsResult;