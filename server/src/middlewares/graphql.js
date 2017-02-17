import GraphHTTP from 'express-graphql';
import Schema from '../api';


export default GraphHTTP(req => ({
  schema: Schema,
  pretty: true,
  graphiql: true,
  rootValue: { user: req.user },
  formatError: e => {    
    return {
      originalError: e.originalError,
      message: e.message,
      locations: e.locations,
      stack: e.stack
    };
  }
}));