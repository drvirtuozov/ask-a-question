import GraphHTTP from 'express-graphql';
import Schema from '../schemas';

export default GraphHTTP(req => ({
  schema: Schema,
  pretty: true,
  graphiql: true,
  rootValue: { token: req.token }
}));