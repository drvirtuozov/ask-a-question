const db = require('../db');


const AnswerComment = db.import('answer_comment', (sequelize, DataTypes) => {
  const { STRING } = DataTypes;

  return sequelize.define('answer_comment', {
    text: {
      type: STRING,
      allowNull: false,
    },
  }, { underscored: true });
});

module.exports = AnswerComment;
