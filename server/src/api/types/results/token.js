const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const GraphQLError = require('../error');


const GraphQLTokenResult = new GraphQLObjectType({
  name: 'TokenResult',
  fields: {
    token: { 
      type: GraphQLString
    },
    errors: { 
      type: new GraphQLList(GraphQLError) 
    }
  }
});

module.exports = GraphQLTokenResult;
