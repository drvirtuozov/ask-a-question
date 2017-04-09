const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } = require('graphql');
const GraphQLUser = require('./user');


const GraphQLQuestion = new GraphQLObjectType({
  name: 'Question',
  description: 'This represents a Question',
  fields: {
    id: {
      type: GraphQLInt,
      resolve(question) {
        return question.id;
      },
    },
    text: {
      type: GraphQLString,
      resolve(question) {
        return question.text;
      },
    },
    from: {
      type: GraphQLUser,
      resolve(question) {
        return question.getFrom();
      },
    },
    timestamp: {
      type: GraphQLFloat,
      resolve(question) {
        return new Date(question.created_at).getTime();
      },
    },
  },
});

module.exports = GraphQLQuestion;
