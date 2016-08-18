import React from 'react';
import { isNull, isEmail, isAlphanumeric } from 'validator';
import TextFormField from '../common/TextFormField';
import { USERNAME_TAKEN, EMAIL_TAKEN, FIELD_REQUIRED, WRONG_SYMBOLS } from '../../../server/shared/formErrors';

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
  
  checkUserExists(e) {
    let field = e.target.name,
      value = e.target.value;
      
    if (value !== '') {
      this.props.isUserExists(value)
        .then(res => {
          if (res.data.user) {
            let state = this.state;
            state.errors[field] = (field === "username" ? USERNAME_TAKEN : EMAIL_TAKEN);
            
            this.setState(state);
          }
        })
        .catch(() => {
          let state = this.state;
          state.errors[field] = '';
          
          this.setState(state);
        });
    }
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
    let data = this.state,
      errors = data.errors;
    
    if (!isAlphanumeric(data.username)) {
      errors.username = WRONG_SYMBOLS;
    }
    
    if (isNull(data.username)) {
      errors.username = FIELD_REQUIRED;
    }
    
    if (!isEmail(data.email)) {
      errors.email = FIELD_REQUIRED;
    }
    
    if (isNull(data.email)) {
      errors.email = FIELD_REQUIRED;
    }
    
    if (isNull(data.password)) {
      errors.password = FIELD_REQUIRED;
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
        <h2>Don't have an account?</h2>
        <h3>Let's create one!</h3>
        
        <TextFormField 
          error={errors.username}
          label="Username"
          onChange={this.onChange.bind(this)}
          checkUserExists={this.checkUserExists.bind(this)}
          value={this.state.username}
          field="username"
        />
        
        <TextFormField 
          error={errors.email}
          label="Email"
          onChange={this.onChange.bind(this)}
          checkUserExists={this.checkUserExists.bind(this)}
          value={this.state.email}
          field="email"
        />
        
        <TextFormField
          type="password"
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
  addFlashMessage: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired
};

SignupForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};