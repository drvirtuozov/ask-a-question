"use strict";

const express = require('express');
const router = express.Router();
const User = require("../../models/User");


router.post('/', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    console.log(username, password);
    
    if (!(username && password)) {
        return res.status(400).json({ok: false, error: "Not enough params."});
    }

    User.authorize(username, password, (err, token) => {
        if (err) return res.status(500).json({ok: false, error: err.message});
        
        res.status(200).json({ok: true, token: token});
    });
});

module.exports = router;