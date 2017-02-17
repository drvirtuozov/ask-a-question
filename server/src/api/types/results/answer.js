import { GraphQLObjectType, GraphQLList } from 'graphql';
import GraphQLError from '../error';
import GraphQLAnswer from '../answer';


const GraphQLAnswerResult = new GraphQLObjectType({
  name: 'AnswerResult',
  fields: {
    answer: { 
      type: GraphQLAnswer
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

export default GraphQLAnswerResult;