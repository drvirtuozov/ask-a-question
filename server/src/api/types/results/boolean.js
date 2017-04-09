const { GraphQLObjectType, GraphQLBoolean, GraphQLList } = require('graphql');
const GraphQLError = require('../error');


const GraphQLBooleanResult = new GraphQLObjectType({
  name: 'BooleanResult',
  fields: {
    ok: {
      type: GraphQLBoolean,
    },
    errors: {
      type: new GraphQLList(GraphQLError),
    },
  },
});

module.exports = GraphQLBooleanResult;
