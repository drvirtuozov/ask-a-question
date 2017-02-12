import db from '../db';

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
    },
    email: {
      type: STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    first_name: {
      type: STRING,
      allowNull: false
    },
    last_name: {
      type: STRING
    }
  }, { underscored: true });
});

export default User;