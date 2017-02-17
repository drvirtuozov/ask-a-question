import { GraphQLObjectType, GraphQLList } from 'graphql';
import GraphQLError from '../error';
import GraphQLUser from '../user';


const GraphQLUserResult = new GraphQLObjectType({
  name: 'UserResult',
  fields: {
    user: { 
      type: GraphQLUser
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

export default GraphQLUserResult;