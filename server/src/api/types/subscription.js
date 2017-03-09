import { GraphQLObjectType } from 'graphql';
import GraphQLQuestion from './question';


const GraphQLSubscription = new GraphQLObjectType({
  name: 'Subscription',
  description: 'Subscription types',
  fields: {
    questionCreated: {
      type: GraphQLQuestion,
      resolve(question) {
        return question;
      }
    } 
  }
});

export default GraphQLSubscription;