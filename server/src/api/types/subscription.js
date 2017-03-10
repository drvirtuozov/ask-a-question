import { GraphQLObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import GraphQLQuestion from './question';
import GraphQLAnswer from './answer';


const GraphQLSubscription = new GraphQLObjectType({
  name: 'Subscription',
  description: 'Subscription types',
  fields: {
    questionCreated: {
      type: GraphQLQuestion,
      args: {
        user_id: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(question) {
        return question;
      }
    },
    questionReplied: {
      type: GraphQLAnswer,
      resolve(answer) {
        return answer;
      }
    } 
  }
});

export default GraphQLSubscription;