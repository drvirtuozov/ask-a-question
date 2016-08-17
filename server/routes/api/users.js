import express from 'express';
import User from '../../models/User';
import HttpError from '../../errors/http';


const router = express.Router();

router.get("/", (req, res) => {
  User.find({}, "username")
    .then(data => {
      res.json({ok: true, users: data});
    })
    .catch(err => {
      res.status(500).json({ok: false, error: err.message});
    });
});

router.get("/:username", (req, res) => {
  let username = req.params.username;
  
  User.findOne({ $or: [ { username }, { email: username } ] }, { firstname: true, lastname: true, email: true })
    .then(data => {
      if (!data) return res.status(404).json({ ok: false, description: "There's no that user." });
      
      res.json({ ok: true, user: data });
    })
    .catch(err => {
      res.status(500).json({ ok: false, description: err.message });
    });
});

router.post('/', (req, res) => {
  User.create(req.body)
    .then(user => {
      res.json({ ok: true, token: user.tokens[0] });
    })
    .catch(err => {
      let result = {
        errors: {}
      },
        description = new HttpError(400, err.message).message;
      
      for (let error in err.errors) {
        result.errors[error] = err.errors[error].message;
      }
      
      res.status(400).json({ ok: false, description, result });
    });
});

export default router;