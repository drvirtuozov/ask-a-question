const GraphHTTP = require('express-graphql');
const { Schema } = require('../api');


module.exports = GraphHTTP(req => ({
  schema: Schema,
  pretty: true,
  graphiql: true,
  rootValue: { user: req.user },
  formatError: e => ({
    originalError: e.originalError,
    message: e.message,
    locations: e.locations,
    stack: e.stack,
  }),
}));
