import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import { tokenNotProvided, userNotFound, questionNotFound, answerNotFound } from '../../errors/api';
import User from '../../models/user';
import UserQuestion from '../../models/user_question';
import UserAnswer from '../../models/user_answer';
import GraphQLUserResult from './results/user';
import GraphQLQuestionsResult from './results/questions';
import GraphQLAnswersResult from './results/answers';
import GraphQLCommentsResult from './results/comments';
import GraphQLLikesResult from './results/likes';


const GraphQLQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields() {
    return {
      user: {
        type: GraphQLUserResult,
        args: {
          username: {
            type: GraphQLString
          }
        },
        async resolve(root, args, ctx) {
          let user = await User.findOne({ where: args }),
            errors = [];
          
          if (!user) errors.push(userNotFound({ field: 'username' }));

          return {
            user,
            errors: errors.length ? errors : null
          }; 
        }
      },
      questions: {
        type: GraphQLQuestionsResult,
        async resolve(root, args, ctx) {
          let questions = null,
            errors = [];

          if (ctx.user) {
            questions = await UserQuestion.findAll({ where: { user_id: ctx.user.id, deleted: false }});
          } else {
            errors.push(tokenNotProvided());
          }

          return {
            questions,
            errors: errors.length ? errors : null
          };
        }
      },
      answers: {
        type: GraphQLAnswersResult,
        args: {
          user_id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        async resolve(root, { user_id }) {
          let user = await User.findById(user_id),
            answers = null,
            errors = [];

          if (user) {
            answers = await user.getAnswers();
          } else {
            errors.push(userNotFound({ field: 'user_id' }));
          }

          return {
            answers,
            errors: errors.length ? errors : null
          };
        }
      },
      comments: {
        type: GraphQLCommentsResult,
        args: {
          answer_id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        async resolve(root, { answer_id }) {
          let answer = await UserAnswer.findById(answer_id),
            comments = null,
            errors = [];

          if (answer) {
            comments = await answer.getComments();
          } else {
            errors.push(answerNotFound({ field: 'answer_id' }));
          }

          return {
            comments,
            errors: errors.length ? errors : null
          }
        }
      },
      likes: {
        type: GraphQLLikesResult,
        args: {
          answer_id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        async resolve(root, { answer_id }) {
          let answer = await UserAnswer.findById(answer_id),
            likes = null,
            ids = null,
            users = null,
            errors = [];
          
          if (answer) {
            likes = await answer.getLikes();
            ids = likes.map(like => ({ id: like.user_id }));
            users = await User.findAll({ where: { $or: ids } });
          } else {
            errors.push(answerNotFound({ field: 'answer_id' }));
          }

          return {
            likes: users,
            errors: errors.length ? errors : null
          }
        }
      }
    };
  }
});

export default GraphQLQuery;