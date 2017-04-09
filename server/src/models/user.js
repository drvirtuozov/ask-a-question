const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { 
  USERNAME_TAKEN, INVALID_USERNAME, INVALID_PASSWORD, 
  EMAIL_TAKEN, INVALID_EMAIL 
} = require('../shared/formErrors');


const User = db.import('user', (db, DataTypes) => {
  const { STRING } = DataTypes;

  return db.define('user', {
    username: {
      type: STRING,
      allowNull: false,
      unique: {
        msg: USERNAME_TAKEN
      },
      validate: {
        is: {
          args: /^[a-z]+$/i,
          msg: INVALID_USERNAME
        },
        len: {
          args: [5, 50],
          msg: INVALID_USERNAME
        }
      }
    },
    password: {
      type: STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 80],
          msg: INVALID_PASSWORD
        }
      },
      set(password) {
        if (password.length < 8) return this.setDataValue('password', password);
        return this.setDataValue('password', bcrypt.hashSync(password, 8));
      }
    },
    email: {
      type: STRING,
      allowNull: false,
      unique: {
        msg: EMAIL_TAKEN
      },
      validate: {
        isEmail: {
          msg: INVALID_EMAIL
        }
      }
    },
    first_name: {
      type: STRING
    },
    last_name: {
      type: STRING
    }
  }, { underscored: true });
});

User.comparePasswords = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

User.sign = user => {
  let { id, username } = user; 
  return jwt.sign({ id, username }, config.jwtSecret);
};

User.addHook('afterCreate', user => {
  user.createQuestion({ text: 'First random question from admin', from_id: 1 });
  user.createQuestion({ text: 'Second random question from admin', from_id: 1 });
  user.createQuestion({ text: 'Third random question from admin', from_id: 1 });
});

module.exports = User;
