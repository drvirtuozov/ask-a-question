import express from 'express';
import Validator from 'validator';
import User from '../../models/User';


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
  
  User.findOne({ username }, { firstname: true, lastname: true, email: true })
    .then(data => {
      if (!data) return res.status(404).json({ ok: false, description: "There's no that user." });
      
      res.json({ ok: true, user: data });
    })
    .catch(err => {
      res.status(500).json({ ok: false, description: err.message });
    });
});

router.post('/', (req, res) => {
  let { errors, isValid } = validateInput(req.body);
  
  if (isValid) {
    User.create(req.body)
      .then(user => {
        res.json({ ok: true, token: user.tokens[0] });
      })
      .catch(err => {
        res.status(500).json({ ok: false, description: err.message });
      });
  } else {
    return res.status(400).json(errors);
  }
});

function validateInput(data) {
  let errors = {};
  
  if(Validator.isNull(data.username)) {
    errors.username = "This field is required";
  }
  
  if(Validator.isNull(data.email)) {
    errors.email = "This field is required";
  }
  
  if(!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  
  if(Validator.isNull(data.password)) {
    errors.password = "This field is required";
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length ? false : true 
  };
}

export default router;