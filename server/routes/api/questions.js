"use strict";

const express = require('express');
const router = express.Router();
const User = require("../../models/User");


router.get("/", (req, res) => {
  let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"].split(" ")[1];
  
  User.checkToken(token)
    .then(data => {
      return User.findOne({username: data.username}, "questions");
    })
    .then(data => {
      res.json({ok: true, questions: data.questions});
    })
    .catch(err => {
      return res.status(500).json({ok: false, error: err.message});
    });
});

router.post('/', (req, res) => {
  let username = req.body.username;
  let text = req.body.text;
  
  if (!(username && text)) {
      return res.status(400).json({ok: false, error: "Not enough params."});
  }
  
  let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"].split(" ")[1];
  let question = {
    text: text,
    timestamp: Date.now()
  };
  
  User.checkToken(token)
    .then(data => {
      if (data) question.from = data.username;
      
      return User.findOneAndUpdate({username: username}, {$push: {"questions": question}});
    }, err => {
      res.status(403).json({ok: false, error: err.message});
    })
    .then(() => {
      res.json({ok: true});
    })
    .catch(err => {
      if (err) return res.status(500).json({ok: false, error: err.message});
      
      res.json({ok: true});
    });
});

module.exports = router;