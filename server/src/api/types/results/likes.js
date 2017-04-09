const { GraphQLObjectType, GraphQLList } = require('graphql');
const GraphQLError = require( '../error');
const GraphQLUser = require( '../user');


const GraphQLLikesResult = new GraphQLObjectType({
  name: 'UsersResult',
  fields: {
    likes: { 
      type: new GraphQLList(GraphQLUser)
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

module.exports = GraphQLLikesResult;
