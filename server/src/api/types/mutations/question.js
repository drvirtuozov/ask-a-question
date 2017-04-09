const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');
const GraphQLQuestionResult = require('../results/question');
const GraphQLAnswerResult = require('../results/answer');
const GraphQLBooleanResult = require('../results/boolean');
const User = require('../../../models/user');
const UserQuestion = require('../../../models/userQuestion');
const { userNotFound, questionNotFound, tokenNotProvided } = require('../../../errors/api');
const { pubsub } = require('../../');


const GraphQLQuestionMutations = new GraphQLObjectType({
  name: 'QuestionMutations',
  description: 'Question mutations',
  fields: {
    create: {
      type: GraphQLQuestionResult,
      args: {
        user_id: {
          type: new GraphQLNonNull(GraphQLInt),
        },
        text: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(_, { user_id, text }, ctx) {
        const user = await User.findById(user_id);
        let question = null;
        const errors = [];

        if (user) {
          if (ctx.user) {
            const askingUser = await User.findById(ctx.user.id);
            question = await user.createQuestion({ text });
            await question.setFrom(askingUser);
          } else {
            question = await user.createQuestion({ text });
          }

          pubsub.publish('questionCreated', question);
        } else {
          errors.push(userNotFound({ field: 'user_id' }));
        }

        return {
          question,
          errors: errors.length ? errors : null,
        };
      },
    },
    reply: {
      type: GraphQLAnswerResult,
      args: {
        question_id: {
          type: new GraphQLNonNull(GraphQLInt),
        },
        text: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(_, { question_id, text }, ctx) {
        let answer = null;
        const errors = [];

        if (ctx.user) {
          const user = await User.findById(ctx.user.id);
          const question = await UserQuestion.findOne({
            where: { id: question_id, user_id: ctx.user.id, deleted: false },
          });

          if (question) {
            answer = await question.createAnswer({ text, user_id: user.id });
            question.setDataValue('deleted', true);
            await answer.setQuestion(question);
            pubsub.publish('questionReplied', answer);
          } else {
            errors.push(questionNotFound({ field: 'question_id' }));
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
    delete: {
      type: GraphQLBooleanResult,
      args: {
        question_id: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      async resolve(_, { question_id }, ctx) {
        let ok = false;
        const errors = [];

        if (ctx.user) {
          const res = await UserQuestion.update({ deleted: true }, {
            where: { id: question_id, user_id: ctx.user.id, deleted: false },
          });
          const [affectedCount] = res;

          if (affectedCount) {
            ok = true;
          } else {
            errors.push(questionNotFound({ field: 'question_id' }));
          }
        } else {
          errors.push(tokenNotProvided());
        }

        return {
          ok,
          errors: errors.length ? errors : null,
        };
      },
    },
    restore: {
      type: GraphQLBooleanResult,
      args: {
        question_id: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      async resolve(_, { question_id }, ctx) {
        let ok = false;
        const errors = [];

        if (ctx.user) {
          const res = await UserQuestion.update({ deleted: false }, {
            where: { id: question_id, user_id: ctx.user.id, deleted: true },
          });
          const [affectedCount] = res;

          if (affectedCount) {
            ok = true;
          } else {
            errors.push(questionNotFound({ field: 'question_id' }));
          }
        } else {
          errors.push(tokenNotProvided());
        }

        return {
          ok,
          errors: errors.length ? errors : null,
        };
      },
    },
  },
});

module.exports = GraphQLQuestionMutations;
