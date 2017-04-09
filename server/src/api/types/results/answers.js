const { GraphQLObjectType, GraphQLList } = require('graphql');
const GraphQLError = require('../error');
const GraphQLAnswer = require('../answer');


const GraphQLAnswersResult = new GraphQLObjectType({
  name: 'AnswersResult',
  fields: {
    answers: { 
      type: new GraphQLList(GraphQLAnswer)
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

module.exports = GraphQLAnswersResult;
