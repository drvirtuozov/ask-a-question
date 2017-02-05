import db from '../db';
import User from '../models/user';
import UserQuestion from '../models/user_question';


User.Question = User.hasMany(UserQuestion, { as: 'questions' });
UserQuestion.belongsTo(User);

export async function createUser(args) {
  let Instance = await User.create(args);

  return Instance.toJSON();
}

export async function findAllUsers(args) {
  let instancesArray = await User.findAll({ where: args }),
    resultsArray = instancesArray.map(Instance => Instance.toJSON());

  return resultsArray;
}

export async function findQuestionsByUsername(username) {
  let Instance = await User.findOne({ 
    where: { username } ,
    include: [{ model: UserQuestion, as: 'questions' }]
  });

  return Instance.toJSON().questions;
}

export async function findUserByIdAndSetTrack(id, track) {
  let Instance = await User.findById(id, { include: [{ model: UserTrack, as: 'track' }] }),
    TrackInstance = await Instance.track.updateAttributes(track),
    user = Instance.dataValues;
  
  user.track = TrackInstance.dataValues;
  return user;
}

export async function findUserByIdAndUpdate(id, updates) {
  let Instance = await User.findById(id),
    UpdatedInstance = await Instance.update(updates);

  return UpdatedInstance.dataValues;
}

export async function findUserByIdAndIncrement(id, query) {
  let Instance = await User.findById(id),
   UpdatedInstance = await Instance.increment(query);

  return UpdatedInstance.dataValues;
}

db.sync({ force: true })
  .then(() => {
    return User.create({
      username: 'drvirtuozov',
      password: '7321',
      email: 'dr.virtuozov@ya.ru',
      first_name: 'Vlad',
      questions: [{ text: 'first question'}, { text: 'second question'}]
    }, {
      include: [
        {
          association: User.Question
        }
      ]
    });
  });