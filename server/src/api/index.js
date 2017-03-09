import { GraphQLSchema } from 'graphql';
import GraphQLQuery from './types/query';
import GraphQLMutation from './types/mutation';
import GraphQLSubscription from './types/subscription';
import { PubSub, SubscriptionManager } from 'graphql-subscriptions';


export const pubsub = new PubSub();

const Schema = new GraphQLSchema({
  query: GraphQLQuery,
  mutation: GraphQLMutation,
  subscription: GraphQLSubscription
});

const subscriptionManager = new SubscriptionManager({
  schema: Schema,
  pubsub,
  setupFunctions: {
    questionCreated: (options, { user_id }) => ({
      newQuestionsChannel: {
        filter: question => {
          return question.user_id === user_id;
        }
      },
    }),
  },
});

/*subscriptionManager.subscribe({
  query: `
    subscription newQuestionsChannel {
      questionCreated(user_id: 1) { 
        id
        text
        from {
          username
        }
      }
    }
  `,
  context: {
    user: {
      id: 1
    }
  },
  callback: (err, data) => console.log('SUBSCRIPTIOOOON:', data),
});*/

pubsub.subscribe('newQuestionsChannel', data => console.log('SUBSCRIPTIOOOON:', data));

export default Schema;