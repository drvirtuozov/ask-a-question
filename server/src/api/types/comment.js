import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } from 'graphql';
import GraphQLUser from './user';
import GraphQLAnswer from './answer';
import UserAnswer from '../../models/user_answer';


const GraphQLComment = new GraphQLObjectType({
  name: 'Comment',
  description: 'This represents a Comment',
  fields() {
    return {
      id: {
        type: GraphQLInt,
        resolve(comment) {
          return comment.id;
        }
      },
      answer: {
        type: GraphQLAnswer,
        resolve(comment) {
          return UserAnswer.findById(comment.user_answer_id);
        }
      },
      text: {
        type: GraphQLString,
        resolve(comment) {
          return comment.text;
        }
      },
      user: {
        type: GraphQLUser,
        resolve(comment) {
          return comment.getUser();
        }
      },
      timestamp: {
        type: GraphQLFloat,
        resolve(comment) {
          return new Date(comment.created_at).getTime();
        }
      }
    };
  }
});

export default GraphQLComment;