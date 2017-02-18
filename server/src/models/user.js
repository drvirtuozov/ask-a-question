import db from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';


const User = db.import('user', (db, DataTypes) => {
  const { STRING } = DataTypes;

  return db.define('user', {
    username: {
      type: STRING,
      allowNull: false,
      unique: {
        msg: 'There\'s already a user with this username'
      },
      validate: {
        is: {
          args: /^[a-z]+$/i,
          msg: 'Username must only be with letters and not shorter than 5 symbols'
        },
        len: {
          args: [5, 50],
          msg: 'Username must only be with letters and not shorter than 5 symbols'
        }
      }
    },
    password: {
      type: STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 80],
          msg: 'Password must not be shorter than 8 symbols'
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
        msg: 'There\'s already a user with this email'
      },
      validate: {
        isEmail: {
          msg: 'Wrong email'
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
  return jwt.sign({ id: user.id }, config.jwtSecret);
};

export default User;