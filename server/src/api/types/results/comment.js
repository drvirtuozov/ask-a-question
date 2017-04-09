const { GraphQLObjectType, GraphQLList } = require('graphql');
const GraphQLError = require('../error');
const GraphQLComment = require('../comment');


const GraphQLCommentResult = new GraphQLObjectType({
  name: 'CommentResult',
  fields: {
    comment: { 
      type: GraphQLComment
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

module.exports = GraphQLCommentResult;
