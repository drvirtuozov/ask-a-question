import axios from 'axios';


export function isUserExists(username) {
  return async () => {
    const res = await axios.post('/api', {
      query: `{ 
        getUser(username: "${username}") { 
          user {
            id
          }
          errors {
            field
            detail
          }
        } 
      }`,
    });

    return res.data.data.getUser.user ? true : false;
  };
}

export function getUser(username) {
  return async () => {
    const res = await axios.post('/api', {
      query: `{ 
        getUser(username: "${username}") { 
          user {
            id
          }
          errors {
            field
            detail
          }
        } 
      }`,
    });

    return res.data.data.getUser;
  };
}
