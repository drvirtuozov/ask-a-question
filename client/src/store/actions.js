import jwtDecode from 'jwt-decode';
import token from '../api/token';


export default {
  async login(ctx, { username, password }) {
    const res = await token.create(username, password);
    const user = jwtDecode(res.data);
    localStorage.setItem('token', res.data);
    ctx.commit('setUser', user);
  },
  async logout(ctx) {
    localStorage.removeItem('token');
    ctx.commit('setUser');
  },
};
