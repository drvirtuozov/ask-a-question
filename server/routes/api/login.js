"use strict";

const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const HttpError = require("../../error/http");


router.post("/", (req, res) => {
  let username = req.body.username,
    password = req.body.password;
  
  if (!(username && password)) {
    let err = new HttpError(400, "Not enough params.");
    return res.status(err.status).json({ ok: false, description: err.message });
  }

  User.authorize(username, password)
    .then(token => {
      res.status(200).json({ ok: true, token });
    })
    .catch(err => {
      res.status(err.status || 500).json({ ok: false, description: err.message });
    });
});

module.exports = router;