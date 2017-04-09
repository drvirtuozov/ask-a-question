const db = require('../db');


const UserAnswer = db.import('user_answer', (sequelize, DataTypes) => {
  const { STRING } = DataTypes;

  return sequelize.define('user_answer', {
    text: {
      type: STRING,
      allowNull: false,
    },
  }, { underscored: true });
});

module.exports = UserAnswer;
