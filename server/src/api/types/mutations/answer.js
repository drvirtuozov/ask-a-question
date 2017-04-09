const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');
const GraphQLAnswerResult = require('../results/answer');
const GraphQLCommentResult = require('../results/comment');
const User = require('../../../models/user');
const UserAnswer = require('../../../models/userAnswer');
const { tokenNotProvided, answerNotFound } = require('../../../errors/api');
const { pubsub } = require('../../');


const GraphQLAnswerMutations = new GraphQLObjectType({
  name: 'AnswerMutations',
  description: 'Answer mutations',
  fields: {
    comment: {
      type: GraphQLCommentResult,
      args: {
        answer_id: {
          type: new GraphQLNonNull(GraphQLInt),
        },
        text: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(_, { answer_id, text }, ctx) {
        const answer = await UserAnswer.findById(answer_id);
        let comment = null;
        const errors = [];

        if (answer) {
          if (ctx.user) {
            const user = await User.findById(ctx.user.id);
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
          errors: errors.length ? errors : null,
        };
      },
    },
    like: {
      type: GraphQLAnswerResult,
      args: {
        answer_id: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      async resolve(_, { answer_id }, ctx) {
        const errors = [];
        let answer = null;

        if (ctx.user) {
          const user = await User.findById(ctx.user.id);
          answer = await UserAnswer.findById(answer_id);

          if (answer) {
            const like = await answer.createLike();
            await like.setUser(user);
          } else {
            errors.push(answerNotFound({ field: 'answer_id' }));
          }
        } else {
          errors.push(tokenNotProvided());
        }

        return {
          answer,
          errors: errors.length ? errors : null,
        };
      },
    },
  },
});

module.exports = GraphQLAnswerMutations;
