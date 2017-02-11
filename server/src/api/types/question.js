import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } from 'graphql';
import GraphQLUser from './user';


const GraphQLQuestion = new GraphQLObjectType({
  name: 'Question',
  description: 'This represents a Question',
  fields() {
    return {
      id: {
        type: GraphQLInt,
        resolve(question) {
          return question.id;
        }
      },
      text: {
        type: GraphQLString,
        resolve(question) {
          return question.text;
        }
      },
      from: {
        type: GraphQLUser,
        resolve(question) {
          return question.getFrom();
        }
      },
      timestamp: {
        type: GraphQLFloat,
        resolve(question) {
          return new Date(question.created_at).getTime();
        }
      }
    };
  }
});

export default GraphQLQuestion;