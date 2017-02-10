import db from '../db';
import User from '../models/user';
import UserQuestion from '../models/user_question';
import UserAnswer from '../models/user_answer';


User.Question = User.hasMany(UserQuestion, { as: 'questions' });
User.Answer = User.hasMany(UserAnswer, { as: 'answers' });
UserQuestion.belongsTo(User);
UserAnswer.belongsTo(User);
UserAnswer.hasOne(UserQuestion, { as: 'question', constraints: false });
UserQuestion.hasOne(UserAnswer, { as: 'answer', constraints: false });

db.sync({ force: true })
  .then(() => {
    return User.create({
      username: 'drvirtuozov',
      password: '7321',
      email: 'dr.virtuozov@ya.ru',
      first_name: 'Vlad',
      questions: [{ text: 'first question' }, { text: 'second question' }, { text: 'third question' }]
      //answers: [{ text: 'An answer to first question', question: { text: 'First question' } }]
    }, {
      include: [
        {
          association: User.Question
        },
        /*{ 
          association: User.Answer,
          include: [{ association: UserAnswer.Question }]
        }*/
      ]
    });
  });