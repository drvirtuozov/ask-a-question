import { GraphQLObjectType, GraphQLString } from 'graphql';
import QuestionSchema from './question';


const AnswerSchema = new GraphQLObjectType({
  name: 'Answer',
  description: 'This represents an Answer',
  fields: () => {
    return {
      text: {
        type: GraphQLString,
        resolve(answer) {
          return answer.text;
        }
      },
      question: {
        type: QuestionSchema,
        resolve(answer) {
          return answer.getQuestion();
        }
      }
    };
  }
});

export default AnswerSchema;