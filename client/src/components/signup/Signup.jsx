import React from 'react';
import { connect } from 'react-redux';
import SignupForm from './SignupForm';
import { isUserExists } from '../../requests/api';
import { signup } from '../../actions/auth';
import { addFlashMessage } from '../../actions/flashMessages';


function Signup(props) {
  return (
    <SignupForm
      signup={props.signup}
      addFlashMessage={props.addFlashMessage}
      isUserExists={props.isUserExists}
    />
  );
}

Signup.propTypes = {
  signup: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired,
};

export default connect(null, { signup, addFlashMessage, isUserExists })(Signup);
