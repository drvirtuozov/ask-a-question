import { GraphQLObjectType, GraphQLBoolean, GraphQLList } from 'graphql';
import GraphQLError from '../error';


const GraphQLBooleanResult = new GraphQLObjectType({
  name: 'BooleanResult',
  fields: {
    ok: {
      type: GraphQLBoolean
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

export default GraphQLBooleanResult;