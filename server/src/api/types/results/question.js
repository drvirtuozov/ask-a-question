const { GraphQLObjectType, GraphQLList } = require('graphql');
const GraphQLError = require('../error');
const GraphQLQuestion = require('../question');


const GraphQLQuestionResult = new GraphQLObjectType({
  name: 'QuestionResult',
  fields: {
    question: {
      type: GraphQLQuestion,
    },
    errors: {
      type: new GraphQLList(GraphQLError),
    },
  },
});

module.exports = GraphQLQuestionResult;
