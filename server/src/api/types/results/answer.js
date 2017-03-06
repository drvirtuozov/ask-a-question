import { GraphQLObjectType, GraphQLList } from 'graphql';
import GraphQLError from '../error';
import GraphQLAnswer from '../answer';


const GraphQLAnswerResult = new GraphQLObjectType({
  name: 'AnswerResult',
  fields: {
    answer: { 
      type: GraphQLAnswer,
      resolve(answer) {
        console.log('INTERCEPTED ANSWER!!!!!', answer);
        return answer;
      }
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

export default GraphQLAnswerResult;