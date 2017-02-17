import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import GraphQLError from '../error';


const GraphQLTokenResult = new GraphQLObjectType({
  name: 'TokenResult',
  fields: {
    token: { 
      type: GraphQLString
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

export default GraphQLTokenResult;