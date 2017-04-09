const { GraphQLObjectType, GraphQLList } = require('graphql');
const GraphQLError = require('../error');
const GraphQLQuestion = require('../question');


const GraphQLQuestionsResult = new GraphQLObjectType({
  name: 'QuestionsResult',
  fields: {
    questions: {
      type: new GraphQLList(GraphQLQuestion),
    },
    errors: {
      type: new GraphQLList(GraphQLError),
    },
  },
});

module.exports = GraphQLQuestionsResult;
