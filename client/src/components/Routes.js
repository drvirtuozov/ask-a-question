import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Container from './Container';
import Index from './Index';
import Signup from './signup/Signup';
import Login from './login/Login';
import Questions from './inbox/Questions';
import Profile from './profile/Profile';
import requireAuth from '../utils/requireAuth';

export default (
  <Route path="/" component={Container}>
    <IndexRoute component={Index} />
    <Route path="signup" component={Signup} />
    <Route path="login" component={Login} />
    <Route path="inbox" component={requireAuth(Questions)} />
    <Route path="*" component={Profile} />
  </Route>  
);