"use strict";

const express = require('express');
const router = express.Router();
const User = require("../../models/User");


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
  let username = req.body.username,
    password = req.body.password;
  
  User.create({ username, password })
    .then(user => {
      res.json({ ok: true, token: user.tokens[0] });
    })
    .catch(err => {
      res.status(500).json({ ok: false, description: err.message });
    });
});

module.exports = router;