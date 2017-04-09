const { GraphQLObjectType, GraphQLList } = require('graphql');
const GraphQLError = require('../error');
const GraphQLAnswer = require('../answer');


const GraphQLAnswerResult = new GraphQLObjectType({
  name: 'AnswerResult',
  fields: {
    answer: {
      type: GraphQLAnswer,
    },
    errors: {
      type: new GraphQLList(GraphQLError),
    },
  },
});

module.exports = GraphQLAnswerResult;
