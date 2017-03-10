import { GraphQLObjectType, GraphQLInt, GraphQLNonNull } from 'graphql';
import GraphQLQuestion from './question';


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
    } 
  }
});

export default GraphQLSubscription;