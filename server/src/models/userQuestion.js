const db = require('../db');


const UserQuestion = db.import('user_question', (sequelize, DataTypes) => {
  const { STRING, BOOLEAN } = DataTypes;

  return sequelize.define('user_question', {
    text: {
      type: STRING,
      allowNull: false,
    },
    deleted: {
      type: BOOLEAN,
      defaultValue: false,
    },
  }, { underscored: true });
});

module.exports = UserQuestion;
