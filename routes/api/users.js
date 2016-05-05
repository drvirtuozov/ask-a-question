"use strict";

const express = require('express');
const router = express.Router();
const User = require("../../models/User");


router.get("/", (req, res) => {
    let username = req.params.username;
    
    User.find({}, "username")
        .then(data => {
            res.json({ok: true, users: data});
        })
        .catch(err => {
            res.status(500).json({ok: false, error: err.message});
        });
});

module.exports = router;