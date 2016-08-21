import express from 'express';
import User from '../../models/User';
import { auth, optionalAuth } from '../../middlewares/auth';
import HttpError from '../../errors/http';


const router = express.Router();

router.get("/", auth, (req, res) => {
  let { username } = req.user;
  
  User.findOne({ username }, 'questions')
    .then(data => {
      data.questions.sort((a, b) => {
        return b.timestamp - a.timestamp;
      });
      res.json({ ok: true, questions: data.questions });
    })
    .catch(error => {
      let err = new HttpError(500, error.message);
      res.status(err.status).json(err.json);
    });
});

router.post('/', optionalAuth, (req, res) => {
  let { username, text } = req.body,
    question = req.user ? { text, from: req.user.username } : { text };
  
  if (!(username && text)) {
    let err = new HttpError(400, 'Not enough params');  
    return res.status(err.status).json(err.json);
  }
  
  User.findOneAndUpdate({ username }, {$push: { questions: question }})
    .then(() => {
      res.json({ ok: true });
    })
    .catch(error => {
      let err = new HttpError(500, error.message);
      res.status(err.status).json(err.json);
    });
});

export default router;