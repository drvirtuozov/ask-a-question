import React from 'react';
import { Link } from 'react-router';
import { isNull, isEmail, isAlpha } from 'validator';
import { 
  USERNAME_TAKEN, EMAIL_TAKEN, FIELD_REQUIRED, 
  INVALID_PASSWORD, INVALID_USERNAME, INVALID_EMAIL
} from '../../../../server/src/shared/formErrors';
import { FormControl, FormGroup, ControlLabel, HelpBlock, InputGroup, Button } from 'react-bootstrap';

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
    let field = e.target.name,
      value = e.target.value,
      error = this.checkFieldError(field, value),
      errors = this.state.errors;

    if (error) {
      errors[field] = error;
    } else {
      delete errors[field];
    }

    this.setState({ 
      [field]: value,
      errors
    });
  }
  
  async checkUserExists(e) {
    let field = e.target.name,
      value = e.target.value,
      errors = this.state.errors;
    
    if (value !== '' && !this.checkFieldError(field, value)) { 
      if (await this.props.isUserExists(value)) {
        errors[field] = (field === 'username' ? USERNAME_TAKEN : EMAIL_TAKEN);
      } else {
        delete errors[field];
      }

      this.setState({ errors }); 
    }
  }
  
  async onSubmit(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    let res = await this.props.createUser(this.state)

    if (res.token) {
      this.props.addFlashMessage({
        type: 'success',
        text: 'You signed up successfully. Welcome!'
      });

      this.context.router.push('/');
    } else {
      this.setState({
        errors: this.apiErrorsToState(res.errors),
        isLoading: false
      });
    }
  }

  apiErrorsToState(errors) {
    let output = {};
    
    for (let e of errors) {
      output[e.field] = e.detail;
    }
    
    return output;
  }
  
  checkFieldError(field, value) {
    let output = null,
      validators = {
        username() {
          if (!isAlpha(value)) {
            output = INVALID_USERNAME;
          }
          
          if (isNull(value)) {
            output = FIELD_REQUIRED;
          }
        },
        email() {
          if (!isEmail(value)) {
            output = INVALID_EMAIL;
          }
          
          if (isNull(value)) {
            output = FIELD_REQUIRED;
          }
        },
        password() {
          if (value.length < 8) {
            output = INVALID_PASSWORD;
          }

          if (isNull(value)) {
            output = FIELD_REQUIRED;
          }
        }
      };
    
    validators[field]();
    return output;
  }
  
  getFieldValidationState(field) {
    if (this.state[field]) {
      if (this.state.errors[field]) {
        return 'error';
      } else {
        return 'success';
      }
    }
  }
  
  render() {
    const { errors, isLoading } = this.state;
  
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <h2>Don't have an account?</h2>
        <h3>Let's create one!</h3>
        
        <FormGroup validationState={this.getFieldValidationState('username')}>
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
        
        <FormGroup validationState={this.getFieldValidationState('email')}>
          <ControlLabel>Email</ControlLabel>
          <InputGroup>
            <InputGroup.Addon><i className="fa fa-at" aria-hidden="true"></i></InputGroup.Addon>
            <FormControl
              name="email"
              type="text"
              onChange={this.onChange.bind(this)}
            />
            <FormControl.Feedback />
          </InputGroup>
          {errors.email && <HelpBlock>{errors.email}</HelpBlock>}
        </FormGroup>
        
        <FormGroup validationState={this.getFieldValidationState('password')}>
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
            disabled={isLoading || Object.keys(errors).length}
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