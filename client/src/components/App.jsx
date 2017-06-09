import React from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import jwtDecode from 'jwt-decode';
import Routes from './Routes';
import rootReducer from '../reducers';
import { setRequestAuthorizationToken } from '../helpers/utils';
import { setCurrentUser } from '../actions/auth';
import { getAndSetQuestionsToStore } from '../actions/questions';
// import '../socket';


export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ),
);

if (localStorage.token) {
  setRequestAuthorizationToken(localStorage.token);
  store.dispatch(setCurrentUser(jwtDecode(localStorage.token)));
  store.dispatch(getAndSetQuestionsToStore());
}

const App = () => (
  <Provider store={store}>
    <Router history={browserHistory} routes={Routes} />
  </Provider>
);

export default App;
