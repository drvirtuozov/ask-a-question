"use strict";

const express = require('express');
const router = express.Router();
const User = require("../models/User");


router.post('/', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    
    User.signup(username, password, (err, token) => {
        if (err) return next(err);
        
        res.json(token);
    });
});

module.exports = router;
