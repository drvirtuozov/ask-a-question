import express from 'express';
import User from '../../models/User';
import HttpError from '../../errors/http';
import { FIELD_REQUIRED } from '../../shared/formErrors';


const router = express.Router();

router.post("/", (req, res) => {
  let { username, password } = req.body,
    result = {
      errors: {}
    };
  
  if (!(username && password)) {
    let err = new HttpError(400, "Not enough parameters");
    if (!username) result.errors.username = FIELD_REQUIRED;
    if (!password) result.errors.password = FIELD_REQUIRED;
    
    return res.status(err.status).json({ ok: false, description: err.message, result });
  }

  User.authorize(username, password)
    .then(token => {
      res.status(200).json({ ok: true, token });
    })
    .catch(err => {
      let result = err.params.result;
      
      res.status(err.status || 500).json({ ok: false, description: err.message, result });
    });
});

export default router;