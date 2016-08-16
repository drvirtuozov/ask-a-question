import React from 'react';
import { isNull, isEmail, isAlphanumeric } from 'validator';
import SignupFormField from './SignupFormField';

export default class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      email: '',
      password: '',
      errors: {},
      isLoading: false
    };
  }
  
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  onSubmit(e) {
    e.preventDefault();
    
    let { errors, isValid } = this.validateInput();
    
    if (isValid) {
      this.setState({ errors: {}, isLoading: true });
      this.props.userSignupRequest(this.state)
        .then(() => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You signed up successfully. Welcome!'
          });
          this.context.router.push('/');
        })
        .catch(err => {
          this.setState({
            errors: err.data.result.errors,
            isLoading: false
          });
        });
    } else {
      this.setState({ errors });
    }
  }
  
  validateInput() {
    let errors = {},
      data = this.state;
    
    if (!isAlphanumeric(data.username)) {
      errors.username = '[A-Z], [0-9] symbols only';
    }
    
    if (isNull(data.username)) {
      errors.username = 'This field is required';
    }
    
    if (!isEmail(data.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (isNull(data.email)) {
      errors.email = 'This field is required';
    }
    
    if (isNull(data.password)) {
      errors.password = 'This field is required';
    }
  
    return {
      errors,
      isValid: Object.keys(errors).length ? false : true
    };
  }
  
  render() {
    const { errors } = this.state;
    
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <h1>Join our community!</h1>
        
        <SignupFormField 
          error={errors.username}
          label="Username"
          onChange={this.onChange.bind(this)}
          value={this.state.username}
          field="username"
        />
        
        <SignupFormField 
          error={errors.email}
          label="Email"
          onChange={this.onChange.bind(this)}
          value={this.state.email}
          field="email"
        />
        
        <SignupFormField 
          error={errors.password}
          label="Password"
          onChange={this.onChange.bind(this)}
          value={this.state.password}
          field="password"
        />
        
        <div className="form-group">
          <button disabled={this.state.isLoading} className="btn btn-primary btn-lg">Sign Up</button>
        </div>
      </form>
    );
  }
}

SignupForm.propTypes = {
  userSignupRequest: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired
};

SignupForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};