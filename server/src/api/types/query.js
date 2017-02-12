import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt } from 'graphql';
import GraphQLUser from './user';
import GraphQLQuestion from './question';
import GraphQLAnswer from './answer';
import GraphQLComment from './comment';
import { tokenNotProvided } from '../../errors/api';
import User from '../../models/user';
import UserAnswer from '../../models/user_answer';
import AnswerLike from '../../models/answer_like';


const GraphQLQuery = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields() {
    return {
      users: {
        type: new GraphQLList(GraphQLUser),
        args: {
          username: {
            type: GraphQLString
          }
        },
        resolve(root, args, ctx) {
          return User.findAll({ where: args });
        }
      },
      questions: {
        type: new GraphQLList(GraphQLQuestion),
        async resolve(root, args, ctx) {
          if (!ctx.user) throw tokenNotProvided;

          let user = await User.findById(ctx.user.id);
          return user.getQuestions();
        }
      },
      answers: {
        type: new GraphQLList(GraphQLAnswer),
        args: {
          user_id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        async resolve(root, { user_id }) {
          let user = await User.findById(user_id);
          return user.getAnswers();
        }
      },
      comments: {
        type: new GraphQLList(GraphQLComment),
        args: {
          answer_id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        async resolve(root, { answer_id }) {
          let answer = await UserAnswer.findById(answer_id);
          return answer.getComments();
        }
      },
      likes: {
        type: new GraphQLList(GraphQLUser),
        args: {
          answer_id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        async resolve(root, { answer_id }) {
          let likes = await AnswerLike.findAll({ where: { user_answer_id: answer_id }}),
            ids = likes.map(like => ({ id: like.user_id }));

          return User.findAll({ where: { $or: ids } });
        }
      }
    };
  }
});

export default GraphQLQuery;