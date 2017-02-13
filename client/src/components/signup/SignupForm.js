import React from 'react';
import { Link } from 'react-router';
import { isNull, isEmail, isAlphanumeric } from 'validator';
import { USERNAME_TAKEN, EMAIL_TAKEN, FIELD_REQUIRED, WRONG_SYMBOLS } from '../../shared/formErrors';
import { FormControl, FormGroup, ControlLabel, HelpBlock, InputGroup, Button } from 'react-bootstrap';

export default class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      email: '',
      password: '',
      errors: {
        username: null,
        email: null,
        password: null
      },
      isLoading: false
    };
  }
  
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  async checkUserExists(e) {
    let field = e.target.name,
      value = e.target.value;
    
    if (value !== '') {
      try {
        let yes = await this.props.isUserExists(value);
        
        if (yes) {
          let state = this.state;
          state.errors[field] = (field === 'username' ? USERNAME_TAKEN : EMAIL_TAKEN);
          
          this.setState(state);
        }
      } catch(e) {
        let state = this.state;
        state.errors[field] = undefined;
        
        this.setState(state);
      }
      
    }
  }
  
  onSubmit(e) {
    e.preventDefault();
    
    let { errors, isValid } = this.validateInput();
    
    if (isValid) {
      this.setState({ errors: {}, isLoading: true });
      this.props.createUser(this.state)
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
  
  setValidationState(e) {
    
  }
  
  getValidationState(field) {
    let errors = this.state.errors;
    
    if (errors[field]) {
      return 'error';
    } else if (errors[field] === undefined) {
      return 'success';
    } else if (errors[field] === null) {
      return;
    }
  }
  
  render() {
    const { errors } = this.state;
    
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <h2>Don't have an account?</h2>
        <h3>Let's create one!</h3>
        
        <FormGroup validationState={this.getValidationState('username')}>
          <ControlLabel>Username</ControlLabel>
          <InputGroup>
            <InputGroup.Addon><i className="fa fa-user" aria-hidden="true"></i></InputGroup.Addon>
            <FormControl
              name="username"
              type="text"
              onChange={this.onChange.bind(this)}
              onBlur={this.checkUserExists.bind(this)}
            />
            <FormControl.Feedback />
          </InputGroup>
          {errors.username && <HelpBlock>{errors.username}</HelpBlock>}
        </FormGroup>
        
        <FormGroup validationState={this.getValidationState('email')}>
          <ControlLabel>Email</ControlLabel>
          <InputGroup>
            <InputGroup.Addon><i className="fa fa-at" aria-hidden="true"></i></InputGroup.Addon>
            <FormControl
              name="email"
              type="text"
              onChange={this.onChange.bind(this)}
              onBlur={this.checkUserExists.bind(this)}
            />
            <FormControl.Feedback />
          </InputGroup>
          {errors.email && <HelpBlock>{errors.email}</HelpBlock>}
        </FormGroup>
        
        <FormGroup validationState={this.getValidationState('password')}>
          <ControlLabel>Password</ControlLabel>
          <InputGroup>
            <InputGroup.Addon><i className="fa fa-lock" aria-hidden="true"></i></InputGroup.Addon>
            <FormControl
              name="password"
              type="password"
              onChange={this.onChange.bind(this)}
            />
            <FormControl.Feedback />
          </InputGroup>
          {errors.password && <HelpBlock>{errors.password}</HelpBlock>}
        </FormGroup>
        
        <FormGroup>
          <Button 
            type="submit" 
            bsSize="large" 
            bsStyle="success" 
            disabled={this.state.isLoading}
          >Sign Up</Button>
          <small>Already have an account? <Link to="/login">Log In</Link></small>
        </FormGroup>
      </form>
    );
  }
}

SignupForm.propTypes = {
  createUser: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired
};

SignupForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};