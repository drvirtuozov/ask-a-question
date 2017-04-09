const { GraphQLSchema } = require('graphql');
const GraphQLQuery = require('./types/query');
const GraphQLMutation = require('./types/mutation');
const GraphQLSubscription = require('./types/subscription');
const { PubSub, SubscriptionManager } = require('graphql-subscriptions');


const pubsub = new PubSub();

const Schema = new GraphQLSchema({
  query: GraphQLQuery,
  mutation: GraphQLMutation,
  subscription: GraphQLSubscription,
});

const subscriptionManager = new SubscriptionManager({
  schema: Schema,
  pubsub,
  setupFunctions: {
    privateSubscriptions: (options, { user_id: userId }) => ({
      questionCreated: {
        filter(question) {
          return question.user_id === userId;
        },
        transform: name => name,
      },
    }),
    publicSubscriptions: () => ({
      questionReplied: {
        filter(answer) {
          return answer.id;
        },
      },
      answerCommented: {
        filter(comment) {
          return comment.id;
        },
      },
    }),
  },
});

module.exports = {
  Schema,
  pubsub,
  subscriptionManager,
};
