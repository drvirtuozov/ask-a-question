import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } from 'graphql';
import GraphQLQuestion from './question';


const GraphQLAnswer = new GraphQLObjectType({
  name: 'Answer',
  description: 'This represents an Answer',
  fields() {
    return {
      id: {
        type: GraphQLInt,
        resolve(answer) {
          return answer.id;
        }
      },
      text: {
        type: GraphQLString,
        resolve(answer) {
          return answer.text;
        }
      },
      question: {
        type: GraphQLQuestion,
        resolve(answer) {
          return answer.getQuestion();
        }
      },
      timestamp: {
        type: GraphQLFloat,
        resolve(answer) {
          return new Date(answer.created_at).getTime();
        }
      }
    };
  }
});

export default GraphQLAnswer;