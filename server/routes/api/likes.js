import express from 'express';
import User from '../../models/User';
import auth from '../../middlewares/auth';
import HttpError from '../../errors/http';


const router = express.Router();

router.post('/', auth, (req, res) => {
  let { username, answer_id } = req.body;
  
  if (!(username && answer_id)) {
    let err = new HttpError(400, 'Not enough params');
    return res.status(err.status).json(err.json);
  }

  User.findOneAndUpdate({ username , 'answers._id': answer_id }, {$addToSet: { 'answers.$.likes': username }})
    .then(() => {
      // error 404 handler here
      res.json({ ok: true });
    })
    .catch(err => {
      res.status(500).json({ ok: false, error: err.message });
    });
});

router.delete('/', auth, (req, res) => {
  let { username, id } = req.body;
  
  if (!(username && id)) {
    return res.status(400).json({ ok: false, error: 'Not enough params.' });
  }
    
  User.findOneAndUpdate({ username , 'answers._id': id }, {$pull: { 'answers.$.likes': username }})
    .then(() => {
      res.json({ ok: true });
    })
    .catch(err => {
      res.status(500).json({ ok: false, error: err.message });
    });
});

export default router;