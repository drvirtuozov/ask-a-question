const db = require('../db');


const AnswerLike = db.import('answer_like', sequelize =>
  sequelize.define('answer_like', {}, { underscored: true }));

module.exports = AnswerLike;
