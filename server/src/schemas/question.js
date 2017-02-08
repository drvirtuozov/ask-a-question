import { GraphQLObjectType, GraphQLString } from 'graphql';


const QuestionSchema = new GraphQLObjectType({
  name: 'Question',
  description: 'This represents a Question',
  fields: () => {
    return {
      text: {
        type: GraphQLString,
        resolve(question) {
          return question.text;
        }
      }
    };
  }
});

export default QuestionSchema;