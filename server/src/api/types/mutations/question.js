import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import GraphQLQuestionResult from '../results/question';
import User from '../../../models/user';
import { userNotFound } from '../../../errors/api';


const GraphQLQuestionMutations = new GraphQLObjectType({
  name: 'QuestionMutations',
  description: 'Question mutations',
  fields: {
    create: {
      type: GraphQLQuestionResult,
      args: {
        user_id: {
          type: new GraphQLNonNull(GraphQLInt)
        },
        text: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(root, { user_id, text }, ctx) {
        let user = await User.findById(user_id),
          question = null,
          errors = [];

        if (user) {
          if (ctx.user) {
            let askingUser = await User.findById(ctx.user.id);
            question = await user.createQuestion({ text }); 
            await question.setFrom(askingUser);             
          } else {
            question = await user.createQuestion({ text });
          }
        } else {
          errors.push(userNotFound({ field: 'user_id' }));
        }

        return {
          question,
          errors: errors.length ? errors : null
        };
      }
    }
  }
});

export default GraphQLQuestionMutations;