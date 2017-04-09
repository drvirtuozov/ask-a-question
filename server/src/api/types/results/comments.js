const { GraphQLObjectType, GraphQLList } = require('graphql');
const GraphQLError = require('../error');
const GraphQLComment = require('../comment');


const GraphQLCommentsResult = new GraphQLObjectType({
  name: 'CommentsResult',
  fields: {
    comments: {
      type: new GraphQLList(GraphQLComment),
    },
    errors: {
      type: new GraphQLList(GraphQLError),
    },
  },
});

module.exports = GraphQLCommentsResult;
