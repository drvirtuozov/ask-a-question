const { GraphQLObjectType, GraphQLInt, GraphQLNonNull } = require('graphql');
const GraphQLQuestion = require('./question');
const GraphQLAnswer = require('./answer');
const GraphQLComment = require('./comment');


const GraphQLSubscription = new GraphQLObjectType({
  name: 'Subscription',
  description: 'Subscription types',
  fields: {
    questionCreated: {
      type: GraphQLQuestion,
      args: {
        user_id: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve(question) {
        return question;
      }
    },
    questionReplied: {
      type: GraphQLAnswer,
      resolve(answer) {
        return answer;
      }
    },
    answerCommented: {
      type: GraphQLComment,
      resolve(comment) {
        return comment;
      }
    }    
  }
});

module.exports = GraphQLSubscription;
