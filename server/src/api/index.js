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

export const subscriptionManager = new SubscriptionManager({
  schema: Schema,
  pubsub,
  setupFunctions: {
    questionCreated: (options, { user_id }) => ({
      questionCreated: {
        filter: question => {
          return question.user_id === user_id;
        },
        transform: name => name
      },
    }),
  },
});

export default Schema;