import { GraphQLObjectType, GraphQLList } from 'graphql';
import GraphQLError from '../error';
import GraphQLAnswer from '../answer';


const GraphQLAnswersResult = new GraphQLObjectType({
  name: 'AnswersResult',
  fields: {
    answers: { 
      type: new GraphQLList(GraphQLAnswer)
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

export default GraphQLAnswersResult;