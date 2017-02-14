import db from '../db';
import bcrypt from 'bcryptjs';

const User = db.import('user', (db, DataTypes) => {
  const { STRING } = DataTypes;

  return db.define('user', {
    username: {
      type: STRING,
      allowNull: false
    },
    password: {
      type: STRING,
      allowNull: false,
      set(password) {
        return this.setDataValue('password', bcrypt.hashSync(password, 8));
      }
    },
    email: {
      type: STRING,
      allowNull: false,
      validate: {
        isEmail: true
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

export default User;