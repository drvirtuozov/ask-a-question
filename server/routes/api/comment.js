"use strict";

const express = require("express");
const router = express.Router();
const User = require("../../models/User");


router.post('/', (req, res) => {
  let username = req.body.username;
  let id = req.body.id;
  let text = req.body.text;
  
  if (!(username && id && text)) {
    return res.status(400).json({ ok: false, error: "Not enough params." });
  }
  
  let token = req.body.token || req.query.token || req.headers["x-access-token"];
  let comment = {
    text: text,
    timestamp: Date.now()
  };
  
  User.checkToken(token)
    .then(data => {
      if (data) comment.from = data.username;
      
      return User.findOneAndUpdate({ username , "answers._id": id }, {$push: { "answers.$.comments": comment }});
    }, err => {
      res.status(403).json({ ok: false, error: err.message });
    })
    .then(() => {
      res.json({ ok: true });
    })
    .catch(err => {
      res.status(500).json({ ok: false, error: err.message });
    });
});

module.exports = router;