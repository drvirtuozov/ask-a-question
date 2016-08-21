import express from 'express';
import User from '../../models/User';
import HttpError from '../../errors/http';
import auth from '../../middlewares/auth';


const router = express.Router();

router.get('/:username', (req, res) => {
  let username = req.params.username;

  User.findOne({ username }, 'answers')
    .then(data => {
      if (!data) {
        let err = new HttpError(404, 'User not found');
        return res.status(err.status).json(err.json);
      }
      
      res.json({ ok: true, answers: data.answers });
    })
    .catch(e => {
      let err = new HttpError(500, e.message);
      res.status(err.status).json(err.json);
    });
});

router.post('/', auth, (req, res) => {
  let { text, _id } = req.body,
    { username } = req.user;
  
  if (!(text && _id)) {
    let err = new HttpError(400, 'Not enough params');
    return res.status(err.status).json(err.json);
  }
  
  User.findOne({ username, 'questions._id': _id }, 'questions.$')
    .then(data => {
      let question = data.questions[0];
      
      if (!question) {
        let err = new HttpError(404, 'Question not found');
        return res.status(err.status).json(err.json);
      }
      
      let answer = {
        question: question.text,
        text: text,
        to: question.from
      };
      
      return User.findOneAndUpdate({ username }, {$push: { answers: answer }});
    })
    .then(() => {
      return User.findOneAndUpdate({ username }, {$pull: { questions: { _id }}});
    })
    .then(() => {
      res.json({ ok: true });
    })
    .catch(e => {
      let err = new HttpError(500, e.message);
      res.status(err.status).json(err.json);
    });
});

export default router;