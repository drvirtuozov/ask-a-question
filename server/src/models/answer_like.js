import db from '../db';


const AnswerLike = db.import('answer_like', db => {  
  return db.define('answer_like', {}, { underscored: true });
});

export default AnswerLike;