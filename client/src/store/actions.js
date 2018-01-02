import jwtDecode from 'jwt-decode';
import token from '../api/token';
import user from '../api/user';


export default {
  async login(ctx, { username, password }) {
    const tkn = await token.create(username, password);
    const usr = jwtDecode(tkn);
    localStorage.setItem('token', tkn);
    ctx.commit('setUser', usr);
  },
  async logout(ctx) {
    localStorage.removeItem('token');
    ctx.commit('setUser');
  },
  async getQuestions(ctx, tkn) {
    const questions = await user.getQuestions(tkn);
    ctx.commit('setQuestions', questions);
  },
};
