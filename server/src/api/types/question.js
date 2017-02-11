import { GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql';


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
        type: GraphQLInt,
        resolve(question) {
          return question.from;
        }
      }
    };
  }
});

export default GraphQLQuestion;