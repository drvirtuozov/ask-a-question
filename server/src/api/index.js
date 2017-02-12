import { GraphQLSchema } from 'graphql';
import GraphQLQuery from './types/query';
import GraphQLMutation from './types/mutation';


const Schema = new GraphQLSchema({
  query: GraphQLQuery,
  mutation: GraphQLMutation
});

export default Schema;