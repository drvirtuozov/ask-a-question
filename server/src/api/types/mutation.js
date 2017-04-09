const { GraphQLObjectType } = require('graphql');
const GraphQLTokenMutations = require('./mutations/token');
const GraphQLUserMutations = require('./mutations/user');
const GraphQLQuestionMutations = require('./mutations/question');
const GraphQLAnswerMutations = require('./mutations/answer');


const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Mutation types',
  fields: {
    token: {
      type: GraphQLTokenMutations,
      resolve: () => GraphQLTokenMutations,
    },
    user: {
      type: GraphQLUserMutations,
      resolve: () => GraphQLUserMutations,
    },
    question: {
      type: GraphQLQuestionMutations,
      resolve: () => GraphQLQuestionMutations,
    },
    answer: {
      type: GraphQLAnswerMutations,
      resolve: () => GraphQLAnswerMutations,
    },
  },
});

module.exports = GraphQLMutation;
