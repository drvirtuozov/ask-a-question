import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } from 'graphql';
import GraphQLQuestionResult from '../results/question';
import GraphQLAnswerResult from '../results/answer';
import User from '../../../models/user';
import UserQuestion from '../../../models/user_question';
import { userNotFound, questionNotFound, tokenNotProvided } from '../../../errors/api';


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
    },
    reply: {
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
            question = await UserQuestion.findOne({ where: { id: question_id, user_id: ctx.user.id }});

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
    }
  }
});

export default GraphQLQuestionMutations;