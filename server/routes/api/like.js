"use strict";

const express = require("express");
const router = express.Router();
const User = require("../../models/User");


router.post("/", (req, res) => {
  let username = req.body.username;
  let id = req.body.id;
  
  if (!(username && id)) {
    return res.status(400).json({ ok: false, error: "Not enough params." });
  }

  User.findOneAndUpdate({ username , "answers._id": id}, {$addToSet: { "answers.$.likes": username }})
    .then(() => {
      res.json({ ok: true });
    })
    .catch(err => {
      res.status(500).json({ ok: false, error: err.message });
    });
});

router.delete('/', (req, res) => {
  let username = req.body.username;
  let id = req.body.id;
  
  if (!(username && id)) {
    return res.status(400).json({ ok: false, error: "Not enough params." });
  }
    
  User.findOneAndUpdate({ username , "answers._id": id}, {$pull: { "answers.$.likes": username }})
    .then(() => {
      res.json({ ok: true });
    })
    .catch(err => {
      res.status(500).json({ ok: false, error: err.message });
    });
});

module.exports = router;