import { GraphQLObjectType } from 'graphql';
import GraphQLTokenMutations from './mutations/token';
import GraphQLUserMutations from './mutations/user';
import GraphQLQuestionMutations from './mutations/question';
import GraphQLAnswerMutations from './mutations/answer';


const GraphQLMutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Mutation types',
  fields: {
    token: {
      type: GraphQLTokenMutations
    },
    user: {
      type: GraphQLUserMutations
    },
    question: {
      type: GraphQLQuestionMutations
    },
    answer: {
      type: GraphQLAnswerMutations
    }
  }
});

export default GraphQLMutation;