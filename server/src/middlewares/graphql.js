import GraphHTTP from 'express-graphql';
import Schema from '../schemas';

export default GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
});