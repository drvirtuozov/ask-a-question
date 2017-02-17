import { GraphQLObjectType, GraphQLList } from 'graphql';
import GraphQLError from '../error';
import GraphQLQuestion from '../question';


const GraphQLQuestionResult = new GraphQLObjectType({
  name: 'QuestionResult',
  fields: {
    question: { 
      type: GraphQLQuestion
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

export default GraphQLQuestionResult;