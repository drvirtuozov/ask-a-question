import { GraphQLObjectType, GraphQLString } from 'graphql';


const Answer = new GraphQLObjectType({
  name: 'Answer',
  description: 'This represents an Answer',
  fields: () => {
    return {
      text: {
        type: GraphQLString,
        resolve(answer) {
          return answer.text;
        }
      }
    };
  }
});

export default Answer;