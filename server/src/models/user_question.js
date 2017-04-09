const db = require('../db');


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

module.exports = UserQuestion;
