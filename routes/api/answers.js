"use strict";

const express = require('express');
const router = express.Router();
const User = require("../../models/User");


router.get('/:username', (req, res) => {
    let username = req.params.username;

    User.findOne({username: username}, "answers")
        .then((data) => {
            if (!data) res.status(404).json({ok: false, error: "User not found."});
            
            res.json({ok: true, answers: data.answers});
        })
        .catch(err => {
            res.status(500).json({ok: false, error: err.message});
        });
        
});

router.post('/', (req, res) => {
    let text = req.body.text;
    let id = req.body.id;
    let username = "";
    let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"].split(" ")[1];
    
    if (!(text && id && token)) {
        return res.status(400).json({ok: false, error: "Not enough params."});
    }
    
    User.checkToken(token)
        .then(data => {
            username = data.username;
            return User.findOne({username: username, "questions._id": id}, "questions.$");
        })
        .then(data => {
            let question = data.questions[0];
            
            return question;
        })
        .then(question => {
            let answer = {
                question: question.text,
                text: text,
                to: question.from,
                timestamp: Date.now(),
                comments: []
            };
            
            return User.findOneAndUpdate({username: username}, {$push: {"answers": answer}});
        })
        .then(() => {
            return User.findOneAndUpdate({username: username}, {$pull: {"questions": {_id: id}}});
        })
        .then(() => {
            res.json({ok: true});
        })
        .catch(err => {
            res.status(500).json({ok: false, error: err.message});
        });
});

module.exports = router;