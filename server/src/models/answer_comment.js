const db = require('../db');


const AnswerComment = db.import('answer_comment', (db, DataTypes) => {
  const { STRING } = DataTypes;
  
  return db.define('answer_comment', {
    text: {
      type: STRING,
      allowNull: false
    }
  }, { underscored: true });
});

module.exports = AnswerComment;
