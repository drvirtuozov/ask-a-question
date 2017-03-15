import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import GraphQLAnswerResult from '../results/answer';
import GraphQLCommentResult from '../results/comment';
import User from '../../../models/user';
import UserAnswer from '../../../models/user_answer';
import { tokenNotProvided, answerNotFound } from '../../../errors/api';
import { pubsub } from '../../';


const GraphQLAnswerMutations = new GraphQLObjectType({
  name: 'AnswerMutations',
  description: 'Answer mutations',
  fields: {
    comment: {
      type: GraphQLCommentResult,
      args: {
        answer_id: {
          type: new GraphQLNonNull(GraphQLInt)
        },
        text: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(_, { answer_id, text }, ctx) {
        let answer = await UserAnswer.findById(answer_id),
          comment = null,
          errors = [];

        if (answer) {
          if (ctx.user) {
            let user = await User.findById(ctx.user.id);
            comment = await answer.createComment({ text });
            await comment.setUser(user);
          } else {
            comment = await answer.createComment({ text });
          }

          pubsub.publish('answerCommented', comment);
        } else {
          errors.push(answerNotFound({ field: 'answer_id' }));
        }

        return {
          comment,
          errors: errors.length ? errors : null
        };
      }
    },
    like: {
      type: GraphQLAnswerResult,
      args: {
        answer_id: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      async resolve(_, { answer_id }, ctx) {
        if (ctx.user) {
          var user = await User.findById(ctx.user.id),
            answer = await UserAnswer.findById(answer_id),
            errors = [];

          if (answer) {
            let like = await answer.createLike();
            await like.setUser(user);
          } else {
            errors.push(answerNotFound({ field: 'answer_id' }));
          }
        } else {
          errors.push(tokenNotProvided());
        }

        return {
          answer,
          errors: errors.length ? errors : null
        };
      }
    }
  }
});

export default GraphQLAnswerMutations;