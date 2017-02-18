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
      type: GraphQLTokenMutations,
      resolve: () => GraphQLTokenMutations
    },
    user: {
      type: GraphQLUserMutations,
      resolve: () => GraphQLUserMutations
    },
    question: {
      type: GraphQLQuestionMutations,
      resolve: () => GraphQLQuestionMutations
    },
    answer: {
      type: GraphQLAnswerMutations,
      resolve: () => GraphQLAnswerMutations
    }
  }
});

export default GraphQLMutation;