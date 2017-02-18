import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import GraphQLAnswerResult from '../results/answer';
import GraphQLCommentResult from '../results/comment';
import User from '../../../models/user';
import UserQuestion from '../../../models/user_question';
import UserAnswer from '../../../models/user_answer';
import { questionNotFound, tokenNotProvided, answerNotFound } from '../../../errors/api';


const GraphQLAnswerMutations = new GraphQLObjectType({
  name: 'AnswerMutations',
  description: 'Answer mutations',
  fields: {
    create: {
      type: GraphQLAnswerResult,
      args: {
        question_id: {
          type: new GraphQLNonNull(GraphQLInt)
        },
        text: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(root, { question_id, text }, ctx) {
        let answer = null,
          errors = [];

        if (ctx.user) {
          let user = await User.findById(ctx.user.id),
            question = await UserQuestion.findById(question_id);

          if (question) {
            answer = await question.createAnswer({ text, user_id: user.id });
            await answer.setQuestion(question);
          } else {
            errors.push(questionNotFound({ field: 'question_id' })); 
          }
        } else {
          errors.push(tokenNotProvided());
        }

        return {
          answer,
          errors: errors.length ? errors : null
        };
      }
    },
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
      async resolve(root, { answer_id, text }, ctx) {
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
      async resolve(root, { answer_id }, ctx) {
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