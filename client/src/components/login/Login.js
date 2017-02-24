import React from 'react';
import { connect } from 'react-redux';
import LoginForm from './LoginForm';
import { login } from '../../actions/auth';


class Login extends React.Component {
  render() {
    const { login } = this.props;

    return (
      <LoginForm login={login} /> 
    );
  }
}

LoginForm.propTypes = {
  login: React.PropTypes.func.isRequired
};

export default connect(null, { login })(Login);