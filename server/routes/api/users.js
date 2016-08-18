import express from 'express';
import User from '../../models/User';
import HttpError from '../../errors/http';


const router = express.Router();

router.get('/', (req, res) => {
  User.find({}, 'username')
    .then(data => {
      res.json({ ok: true, users: data });
    })
    .catch(error => {
      let err = new HttpError(500, error.message);
      res.status(err.status).json(err.json);
    });
});

router.get('/:username', (req, res) => {
  let username = req.params.username;
  
  User.findOne({$or: [{ username }, { email: username }]}, { firstname: true, lastname: true, email: true })
    .then(data => {
      if (!data) 
        return res.status(400).json({ ok: false, description: 'There\'s no such user.' });
      
      res.json({ ok: true, user: data });
    })
    .catch(error => {
      let err = new HttpError(500, error.message);
      res.status(err.status).json(err.json);
    });
});

router.post('/', (req, res) => {
  User.create(req.body)
    .then(user => {
      res.json({ ok: true, token: user.tokens[0] });
    })
    .catch(error => {
      let result = {
        errors: {}
      };
      
      for (let err in error.errors) {
        result.errors[err] = error.errors[err].message;
      }
      
      let err = new HttpError(400, error.message, result);
      res.status(err.status).json(err.json);
    });
});

export default router;