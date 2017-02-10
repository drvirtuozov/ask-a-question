import { GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql';
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
      }
    };
  }
});

export default GraphQLAnswer;