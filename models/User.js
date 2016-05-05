"use strict";

const mongoose = require("mongoose");
const crypto = require("crypto");
const Counter = require("./Counter");
const jwt = require("jsonwebtoken");

const Token = require("./Token");


let userSchema = mongoose.Schema({
    _id: {type: Number, index: true, min: 1},
    username: {type: String, match: /[(._\-)a-z]/ig, unique: true, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String},
    email: {type: String},
    password: {type: String, required: true, set: function(password) {return this.encryptPassword(password)}},
    salt: {type: String, required: true},
    tokens: [String],
    timestamp: {type: Number, required: true},
    questions: [{
        text: {type: String, required: true},
        from: {type: String},
        timestamp: {type: Number, required: true}
    }],
    answers: [{
        question: {type: String, required: true},
        text: {type: String, required: true},
        to: {type: String},
        timestamp: {type: Number, required: true},
        comments: [{
            from: {type: String},
            text: {type: String, required: true},
            timestamp: {type: Number, required: true}
        }],
        likes: [String]
    }]
});

userSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac("sha1", this.salt).update(password).digest("hex");
};

userSchema.methods.checkPassword = function(password) {
    return this.password === this.encryptPassword(password);
};

userSchema.pre("save", function(next) {
    let user = this;
    
    Counter.findByIdAndUpdate("users", {$inc: {count: 1}}, {new: true})
        .then(counter => {
            user._id = counter.count;
            user.tokens = [jwt.sign({username: user.username}, "az7321epta")];
            next();
        })
        .catch(err => {
            next(err);
        });
});

userSchema.statics.authorize = function(username, password, callback) {
    let User = this;
    
    User.findOne({"username": username})
        .then(user => {
            if (user) {
                return user.checkPassword(password);
            } else {
                throw new Error("There is no such user.");
            }
            
        })
        .then(isMatch => {
            if (isMatch) {
                return jwt.sign({username: username}, "az7321epta");
            } else {
                throw new Error("Wrong password.");
            }
        })
        .then(token => {
            return User.findOneAndUpdate({"username": username}, {$push: {"tokens": token}}, {new: true});
        })
        .then(user => {
            callback(null, user.tokens[user.tokens.length - 1]);
        })
        .catch(err => {
            callback(err);
        });
};

userSchema.statics.signup = function(username, password, callback) {
    let User = this;
    
    User.create({
        username: username,
        password: password,
        salt: crypto.randomBytes(16).toString("base64"),
        tokens: Array,
        timestamp: Date.now()
    }, (err, user) => {
        if (err) return callback(err);
        
        callback(null, user.tokens[0]);
    });
};

userSchema.statics.logout = function(token, callback) {
    let User = this;
    
    Token.findById({_id: token})
        .then((res) => {
            return User.findByIdAndUpdate(res.user, {$pull: {tokens: token}}, {new: true});
        })
        .then((user) => {
            return Token.remove({_id: token});
        })
        .then(() => {
            callback(null);
        })
        .catch(err => {
            callback(err);
        });
};

userSchema.statics.checkToken = function(token) {
    return new Promise((resolve, reject) => {
        if (token) {
            jwt.verify(token, "az7321epta", (err, data) => {
                if (err) return reject(err);
                
                resolve(data);
            });
        } else {
            resolve();
        }
    });
};

module.exports = mongoose.model("User", userSchema);