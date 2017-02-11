import db from './db';
import User from './models/user';
import UserQuestion from './models/user_question';
import UserAnswer from './models/user_answer';


User.Questions = User.hasMany(UserQuestion, { as: 'questions' });
User.Answers = User.hasMany(UserAnswer, { as: 'answers' });
UserQuestion.belongsTo(User);
UserAnswer.belongsTo(User);
UserAnswer.hasOne(UserQuestion, { as: 'question', constraints: false });
UserQuestion.hasOne(UserAnswer, { as: 'answer', constraints: false });
UserQuestion.belongsTo(User, { as: 'from', constraints: false });


db.sync({ force: true })
  .then(() => {
    return User.create({
      username: 'drvirtuozov',
      password: '7321',
      email: 'dr.virtuozov@ya.ru',
      first_name: 'Vlad',
      questions: [{ text: 'first question' }, { text: 'second question' }, { text: 'third question' }]
    }, {
      include: [{ association: User.Questions }]
    });
  })
  .then(() => {
    return User.create({
      username: 'boratische',
      password: '7321',
      email: 'boratische@yandex.ru',
      first_name: 'Borat',
      last_name: 'Sagdiyev',
      questions: [{ text: 'first question' }, { text: 'second question' }, { text: 'third question' }]
    }, {
      include: [{ association: User.Questions }]
    });
  });