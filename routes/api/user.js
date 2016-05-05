"use strict";

const express = require('express');
const router = express.Router();
const User = require("../../models/User");


router.get("/:username", (req, res) => {
    let username = req.params.username;
    
    User.findOne({username: username}, "username")
        .then(data => {
            if (!data) throw new Error("There is no that user.");
            
            res.json({ok: true, user: data});
        })
        .catch(err => {
            res.status(400).json({ok: false, error: err.message});
        });
});

module.exports = router;