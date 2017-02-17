import { GraphQLObjectType, GraphQLList } from 'graphql';
import GraphQLError from '../error';
import GraphQLQuestion from '../question';


const GraphQLQuestionsResult = new GraphQLObjectType({
  name: 'QuestionsResult',
  fields: {
    questions: { 
      type: new GraphQLList(GraphQLQuestion)
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

export default GraphQLQuestionsResult;