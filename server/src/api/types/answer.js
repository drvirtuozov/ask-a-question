const { 
  GraphQLObjectType, GraphQLInt, GraphQLString, 
  GraphQLFloat, GraphQLList
} = require('graphql');
const GraphQLQuestion = require('./question');
const GraphQLUser = require('./user');
const User = require('../../models/user');


module.exports = new GraphQLObjectType({
  name: 'Answer',
  description: 'This represents an Answer',
  fields() {
    const GraphQLComment = require('./comment'); // need for resolving cyclic dependency

    return {
      id: {
        type: GraphQLInt,
        resolve(answer) {
          return answer.id;
        }
      },
      user: {
        type: GraphQLUser,
        resolve(answer) {
          return answer.getUser();
        }
      },
      text: {
        type: GraphQLString,
        resolve(answer) {
          return answer.text;
        }
      },
      question: {
        type: GraphQLQuestion,
        resolve(answer) {
          return answer.getQuestion();
        }
      },
      comments: {
        type: new GraphQLList(GraphQLComment),
        resolve(answer) {
          return answer.getComments();
        }
      },
      likes: {
        type: new GraphQLList(GraphQLUser),
        async resolve(answer) {
          let likes = await answer.getLikes(),
            ids = likes.map(like => ({ id: like.user_id }));
          return User.findAll({ where: { $or: ids } });
        }
      },
      timestamp: {
        type: GraphQLFloat,
        resolve(answer) {
          return new Date(answer.created_at).getTime();
        }
      }
    };
  }
});
