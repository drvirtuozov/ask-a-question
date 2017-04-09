const { GraphQLObjectType, GraphQLList } = require('graphql');
const GraphQLError = require('../error');
const GraphQLUser = require('../user');


const GraphQLUserResult = new GraphQLObjectType({
  name: 'UserResult',
  fields: {
    user: {
      type: GraphQLUser,
    },
    errors: {
      type: new GraphQLList(GraphQLError),
    },
  },
});

module.exports = GraphQLUserResult;
