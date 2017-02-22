import React from 'react';
import SignupForm from './SignupForm';
import { connect } from 'react-redux';
import { isUserExists } from '../../actions/apiRequests';
import { signup } from '../../actions/auth';
import { addFlashMessage } from '../../actions/flashMessages.js';

class Signup extends React.Component {
  render() {
    const { signup, addFlashMessage, isUserExists } = this.props;
    
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <SignupForm 
            signup={signup} 
            addFlashMessage={addFlashMessage} 
            isUserExists={isUserExists}
          />
        </div>
      </div>
    );
  }
}

Signup.propTypes = {
  signup: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired
};

export default connect(null, { signup, addFlashMessage, isUserExists })(Signup);