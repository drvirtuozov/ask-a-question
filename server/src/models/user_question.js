import db from '../db';


const UserQuestion = db.import('user_question', (db, DataTypes) => {
  const { INTEGER, STRING } = DataTypes;
  
  return db.define('user_question', {
    text: {
      type: STRING,
      allowNull: false
    },
    from: {
      type: INTEGER
    }
  }, { underscored: true });
});

export default UserQuestion;