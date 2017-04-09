const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLFloat } = require('graphql');
const GraphQLUser = require('./user');
const GraphQLAnswer = require('./answer');
const UserAnswer = require('../../models/user_answer');


module.exports = new GraphQLObjectType({
  name: 'Comment',
  description: 'This represents a Comment',
  fields: {
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
  }
});
