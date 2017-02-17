import { GraphQLObjectType, GraphQLList } from 'graphql';
import GraphQLError from '../error';
import GraphQLUser from '../user';


const GraphQLLikesResult = new GraphQLObjectType({
  name: 'UsersResult',
  fields: {
    likes: { 
      type: new GraphQLList(GraphQLUser)
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

export default GraphQLLikesResult;