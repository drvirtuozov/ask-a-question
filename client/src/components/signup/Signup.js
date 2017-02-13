import React from 'react';
import SignupForm from './SignupForm';
import { connect } from 'react-redux';
import { createUser, isUserExists } from '../../actions/apiRequests';
import { addFlashMessage } from '../../actions/flashMessages.js';

class Signup extends React.Component {
  render() {
    const { createUser, addFlashMessage, isUserExists } = this.props;
    
    return (
      <div className="row">
        <div className="col-md-4 col-md-offset-4">
          <SignupForm 
            createUser={createUser} 
            addFlashMessage={addFlashMessage} 
            isUserExists={isUserExists}
          />
        </div>
      </div>
    );
  }
}

Signup.propTypes = {
  createUser: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired
};

export default connect(null, { createUser, addFlashMessage, isUserExists })(Signup);