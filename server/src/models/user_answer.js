import db from '../db';


const UserAnswer = db.import('user_answer', (db, DataTypes) => {
  const { STRING } = DataTypes;
  
  return db.define('user_answer', {
    text: {
      type: STRING,
      allowNull: false
    }
  }, { underscored: true });
});

export default UserAnswer;