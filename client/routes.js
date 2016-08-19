import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Index from './components/Index';
import Signup from './components/signup/Signup';
import Login from './components/login/Login';
import Questions from './components/Questions';
import requireAuth from './utils/requireAuth';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Index} />
    <Route path="signup" component={Signup} />
    <Route path="login" component={Login} />
    <Route path="inbox" component={requireAuth(Questions)} />
  </Route>  
);