const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt } = require('graphql');
const { tokenNotProvided, userNotFound, answerNotFound } = require('../../errors/api');
const User = require('../../models/user');
const UserQuestion = require('../../models/userQuestion');
const UserAnswer = require('../../models/userAnswer');
const GraphQLUserResult = require('./results/user');
const GraphQLQuestionsResult = require('./results/questions');
const GraphQLAnswersResult = require('./results/answers');
const GraphQLCommentsResult = require('./results/comments');
const GraphQLLikesResult = require('./results/likes');


const GraphQLQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields() {
    return {
      user: {
        type: GraphQLUserResult,
        args: {
          username: {
            type: GraphQLString,
          },
        },
        async resolve(root, args) {
          const user = await User.findOne({ where: args });
          const errors = [];

          if (!user) errors.push(userNotFound({ field: 'username' }));

          return {
            user,
            errors: errors.length ? errors : null,
          };
        },
      },
      questions: {
        type: GraphQLQuestionsResult,
        async resolve(root, args, ctx) {
          let questions = null;
          const errors = [];

          if (ctx.user) {
            questions = await UserQuestion.findAll({
              where: { user_id: ctx.user.id, deleted: false },
              order: 'id DESC',
            });
          } else {
            errors.push(tokenNotProvided());
          }

          return {
            questions,
            errors: errors.length ? errors : null,
          };
        },
      },
      answers: {
        type: GraphQLAnswersResult,
        args: {
          user_id: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        async resolve(root, { user_id }) {
          const user = await User.findById(user_id);
          let answers = null;
          const errors = [];

          if (user) {
            answers = await user.getAnswers({ order: 'id DESC' });
          } else {
            errors.push(userNotFound({ field: 'user_id' }));
          }

          return {
            answers,
            errors: errors.length ? errors : null,
          };
        },
      },
      comments: {
        type: GraphQLCommentsResult,
        args: {
          answer_id: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        async resolve(root, { answer_id }) {
          const answer = await UserAnswer.findById(answer_id);
          let comments = null;
          const errors = [];

          if (answer) {
            comments = await answer.getComments();
          } else {
            errors.push(answerNotFound({ field: 'answer_id' }));
          }

          return {
            comments,
            errors: errors.length ? errors : null,
          };
        },
      },
      likes: {
        type: GraphQLLikesResult,
        args: {
          answer_id: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        async resolve(root, { answer_id }) {
          const answer = await UserAnswer.findById(answer_id);
          let likes = null;
          let ids = null;
          let users = null;
          const errors = [];

          if (answer) {
            likes = await answer.getLikes();
            ids = likes.map(like => ({ id: like.user_id }));
            users = await User.findAll({ where: { $or: ids } });
          } else {
            errors.push(answerNotFound({ field: 'answer_id' }));
          }

          return {
            likes: users,
            errors: errors.length ? errors : null,
          };
        },
      },
    };
  },
});

module.exports = GraphQLQuery;
