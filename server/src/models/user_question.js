import db from '../db';
import { sockets } from '../socket';
import GraphQLQuestion from '../api/types/question';
import resolveObjectFieldsByGraphQLType from '../api/utils/resolveObjectFieldsByGraphQLType';


const UserQuestion = db.import('user_question', (db, DataTypes) => {
  const { STRING, BOOLEAN } = DataTypes;
  
  return db.define('user_question', {
    text: {
      type: STRING,
      allowNull: false
    },
    deleted: {
      type: BOOLEAN,
      defaultValue: false
    }
  }, { underscored: true });
});

UserQuestion.hook('afterCreate', async question => {
  let socket = sockets.get(question.user_id);

  if (socket) {
    let resolvedQuestion = await resolveObjectFieldsByGraphQLType(question, GraphQLQuestion);
    socket.emit('question', resolvedQuestion);
  }
});

export default UserQuestion;