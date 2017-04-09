const db = require('./db');
const User = require('./models/user');
const UserQuestion = require('./models/user_question');
const UserAnswer = require('./models/user_answer');
const AnswerComment = require('./models/answer_comment');
const AnswerLike = require('./models/answer_like');


User.Questions = User.hasMany(UserQuestion, { as: 'questions' });
User.Answers = User.hasMany(UserAnswer, { as: 'answers' });
UserQuestion.belongsTo(User);
UserAnswer.belongsTo(User);
UserAnswer.hasOne(UserQuestion, { as: 'question', constraints: false });
UserQuestion.hasOne(UserAnswer, { as: 'answer', constraints: false });
UserQuestion.belongsTo(User, { as: 'from', constraints: false });
UserAnswer.hasMany(AnswerComment, { as: 'comments' });
AnswerComment.belongsTo(User);
UserAnswer.hasMany(AnswerLike, { as: 'likes' });
AnswerLike.belongsTo(User);


db.sync({ force: true })
  .then(() => {
    return User.create({
      username: 'drvirtuozov',
      password: '73217321',
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
      password: '73217321',
      email: 'boratische@yandex.ru',
      first_name: 'Borat',
      last_name: 'Sagdiyev',
      questions: [{ text: 'first question' }, { text: 'second question' }, { text: 'third question' }]
    }, {
      include: [{ association: User.Questions }]
    });
  });