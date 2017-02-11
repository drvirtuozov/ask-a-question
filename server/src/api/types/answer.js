import { 
  GraphQLObjectType, GraphQLInt, GraphQLString, 
  GraphQLFloat, GraphQLList
} from 'graphql';
import GraphQLQuestion from './question';
import GraphQLComment from './comment';


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
      comments: {
        type: new GraphQLList(GraphQLComment),
        resolve(answer) {
          return answer.getComments();
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