import axios from 'axios';


export async function createUser(user) {
  let res = await axios.post('/api', {
    query: `
      mutation { 
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
      }
    `
  });

  return res.data.data.user.create;
}

export async function isUserExists(username) {
  let res = await axios.post('/api', { 
    query: `{ 
      user(username: "${username}") { 
        user {
          username
        }
        errors {
          field
          detail
        }
      } 
    }` 
  });

  return res.data.data.user.user ? true : false;
}

export async function createToken(username, password) {
  let res = await axios.post('/api', { 
    query: `
      mutation {
        token {
          create(username: "${username}", password: "${password}") {
            token
            errors {
              field
              detail
            }
          }
        }
      }
    `
  });

  return res.data.data.token.create;
}

export async function getQuestions() {
  let res = await axios.post('/api', {
    query: `{
      questions {
        questions {
          id
          text
          from {
            username
          }
          timestamp
        }
        errors {
          detail
        }
      }
    }`
  });

  return res.data.data.questions;
}

export async function replyQuestion(id, text) {
  let res = await axios.post('/api', {
    query: `
      mutation {
        question {
          reply(question_id: ${id}, text: "${text}") {
            answer {
              id
            }
            errors {
              field
              detail
            }
          }
        }
      }
    `
  });

  return res.data.data.question.reply;
}

export async function deleteQuestion(id) {
  let res = await axios.post('/api', {
    query: `
      mutation {
        question {
          delete(question_id: ${id}) {
            ok
            errors {
              detail
            }
          }
        }
      }
    `
  });

  return res.data.data.question.delete;
}

export async function restoreQuestion(id) {
  let res = await axios.post('/api', {
    query: `
      mutation {
        question {
          restore(question_id: ${id}) {
            ok
            errors {
              detail
            }
          }
        }
      }
    `
  });

  return res.data.data.question.restore;
}

export async function getAnswers(id) {
  let res = await axios.post('/api', {
    query: `{
      answers(user_id: ${id}) {
        answers {
          id
          text
          question {
            text
            from {
              username
            }
          }
          likes {
            username
          }
          timestamp
        }

        errors {
          detail
        }
      }
    }`
  });

  return res.data.data.answers;
}

export async function getUser(username) {
  let res = await axios.post('/api', {
    query: `{
      user(username: "${username}") {
        user {
          id
          username
          first_name
          last_name
        }

        errors {
          detail
        }
      }
    }`
  });

  return res.data.data.user;
}