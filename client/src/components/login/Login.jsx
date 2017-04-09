import React from 'react';
import { connect } from 'react-redux';
import LoginForm from './LoginForm';
import { login } from '../../actions/auth';


function Login(props) {
  return <LoginForm login={props.login} />;
}

Login.propTypes = {
  login: React.PropTypes.func.isRequired,
};

export default connect(null, { login })(Login);
