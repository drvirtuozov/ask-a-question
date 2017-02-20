import axios from 'axios';


export function createUser(user) {
  return async dispatch => {
    let res = await axios.post('/api', {
      query: `mutation { 
        user {
          create(
            username: "${user.username}",
            password: "${user.password}",
            email: "${user.email}"
          ) { 
            token 
            errors {
              field
              detail
            }
          } 
        }
      }`
    });

    return res.data.data.user.create;
  };
}

export function isUserExists(username) {
  return async dispatch => {
    let res = await axios.post('/api', { 
      query: `{ 
        user(username: "${username}") { 
          user {
            username
          }
          errors {
            detail
          }
        } 
      }` 
    });

    return res.data.data.user.user ? true : false;
  };
}