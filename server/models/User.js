import mongoose from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';
import crypto from 'crypto';
import { isAlphanumeric, isEmail } from 'validator';
import Counter from './Counter';
import jwt from 'jsonwebtoken';
import Token from './Token';
import HttpError from '../errors/http';
import formErrors from '../shared/formErrors';


const userSchema = mongoose.Schema({
  _id: { 
    type: Number,
    min: 1 
  },
  username: { 
    type: String, 
    unique: formErrors.USERNAME_TAKEN,
    index: true,
    required: [true, formErrors.FIELD_REQUIRED],
    validate: {
      validator: isAlphanumeric,
      message: formErrors.WRONG_SYMBOLS
    }
  },
  firstname: { type: String },
  lastname: { type: String },
  email: { 
    type: String,
    unique: formErrors.EMAIL_TAKEN,
    index: true,
    required: [true, formErrors.FIELD_REQUIRED], 
    validate: {
      validator: isEmail,
      message: formErrors.EMAIL_INVALID
    }
  },
  password: { 
    type: String, 
    required: [true, formErrors.FIELD_REQUIRED],
    validate: {
      validator: function(password) {
        return password;
      },
      message: formErrors.PASSWORD_REQUIRED
    },
    set: function(password) {
      password = password.replace(/ /g, s => "");
      return password ? this.encryptPassword(password) : password;
    }
  },
  salt: { 
    type: String, 
    default: crypto.randomBytes(16).toString("base64") 
  },
  tokens: [String],
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

userSchema.plugin(beautifyUnique);

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
      if (!counter) return Counter.create({
        _id: "users",
        count: 1
      });
      
      return counter;
    })
    .then(counter => {
      user.tokens = [jwt.sign({ username: user.username }, "az7321epta")];
      user._id = counter.count;
      next();
    })
    .catch(err => {
      next(err);
    });
});

userSchema.statics.authorize = function(username, password) {
  let User = this;
  
  return User.findOne({ $or: [ { username }, { email: username } ] })
    .then(user => {
      if (!user) 
        throw new HttpError(400, "Wrong parameter", { result: { errors: { username: formErrors.WRONG_USER }}});
      
      return user.checkPassword(password);
    })
    .then(isMatch => {
      if (!isMatch) 
        throw new HttpError(401, "Wrong parameter", { result: { errors: { password: formErrors.WRONG_PASSWORD }}});
        
      return jwt.sign({ username }, "az7321epta");
    })
    .then(token => {
      return User.findOneAndUpdate({ $or: [ { username }, { email: username } ] }, {$push: { tokens: token }}, { new: true });
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
    .then(user => {
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

export default mongoose.model("User", userSchema);