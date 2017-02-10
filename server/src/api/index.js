import { GraphQLSchema } from 'graphql';
import GraphQLQuery from './types/query';
import GraphQLMutation from './types/mutation';
import '../helpers/dbmanager';


const Schema = new GraphQLSchema({
  query: GraphQLQuery,
  mutation: GraphQLMutation
});

export default Schema;