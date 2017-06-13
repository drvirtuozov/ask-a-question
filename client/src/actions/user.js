import { getGraph } from './requests';


export function isUserExists(username) {
  return async () => {
    const res = await getGraph(`{ 
      getUser(username: "${username}") { 
        user {
          id
        }
        errors {
          field
          detail
        }
      } 
    }`);

    return res.getUser.user ? true : false;
  };
}

export function getUser(username) {
  return async () => {
    const res = await getGraph(`{ 
      getUser(username: "${username}") { 
        user {
          id
        }
        errors {
          field
          detail
        }
      } 
    }`);

    return res.getUser;
  };
}
