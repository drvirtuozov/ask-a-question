import React from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import Routes from './Routes';
import rootReducer from '../reducers';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';
import { setCurrentUser } from '../actions/auth';
import getAndSetQuestionsToStore from '../utils/getAndSetQuestionsToStore';
import socketio from 'socket.io-client';


export const store = createStore(
  rootReducer, 
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

if (localStorage.token) {
  setAuthorizationToken(localStorage.token);
  store.dispatch(setCurrentUser(jwtDecode(localStorage.token)));
  getAndSetQuestionsToStore();
}

const App = () => (
  <Provider store={store}>
    <Router history={browserHistory} routes={Routes} />
  </Provider>
);

const socket = socketio();

socket.on('connect', server => {
  console.log('connected to socket server');
});

export default App;