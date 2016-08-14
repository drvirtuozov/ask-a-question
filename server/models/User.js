"use strict";

const mongoose = require("mongoose");
const crypto = require("crypto");
const Counter = require("./Counter");
const jwt = require("jsonwebtoken");
const HttpError = require("../error/http");
const Token = require("./Token");


const userSchema = mongoose.Schema({
  _id: { type: Number, index: true, min: 1 },
  username: { type: String, match: /[(._\-)a-z]/ig, unique: true, required: true },
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  password: { type: String, required: true, set: function(password) { return this.encryptPassword(password) } },
  salt: { type: String, default: crypto.randomBytes(16).toString("base64") },
  tokens: { type: Array, default: jwt.sign({ username: this.username }, "az7321epta") },
  timestamp: { type: Number, default: Date.now() },
  questions: [{
    text: { type: String, required: true },
    from: { type: String},
    timestamp: { type: Number, required: true }
  }],
  answers: [{
    question: { type: String, required: true },
    text: { type: String, required: true },
    to: { type: String},
    timestamp: { type: Number, required: true },
    comments: [{
      from: { type: String },
      text: { type: String, required: true },
      timestamp: { type: Number, required: true }
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
  
  Counter.findByIdAndUpdate("users", { $inc: { count: 1 } }, { new: true })
    .then(counter => {
      user._id = counter.count;
      next();
    })
    .catch(err => {
      next(err);
    });
});

userSchema.statics.authorize = function(username, password) {
  let User = this;
  
  return User.findOne({ username })
    .then(user => {
      if (!user) throw new HttpError(400, "There is no such user.");
      
      return user.checkPassword(password);
    })
    .then(isMatch => {
      if (!isMatch) throw new HttpError(401, "Wrong password.");
        
      return jwt.sign({ username }, "az7321epta");
    })
    .then(token => {
      return User.findOneAndUpdate({ username }, {$push: { tokens: token }}, { new: true });
    })
    .then(user => {
      return user.tokens[user.tokens.length - 1];
    });
};

userSchema.statics.logout = function(token, callback) {
  let User = this;
  
  Token.findById(token)
    .then(res => {
      return User.findByIdAndUpdate(res.user, { $pull: { tokens: token } }, { new: true });
    })
    .then((user) => {
      return Token.remove({ _id: token });
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