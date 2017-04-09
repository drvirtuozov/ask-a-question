const db = require('../db');


const AnswerLike = db.import('answer_like', db => {  
  return db.define('answer_like', {}, { underscored: true });
});

module.exports = AnswerLike;
