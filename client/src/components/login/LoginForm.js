import React from 'react';
import { connect } from 'react-redux';
import { FIELD_REQUIRED } from '../../../../server/src/shared/formErrors';
import { createToken } from '../../actions/apiRequests';
import { FormControl, FormGroup, ControlLabel, HelpBlock, InputGroup, Button } from 'react-bootstrap';
import { isNull } from 'validator';


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      password: '',
      errors: {},
      isLoading: false
    };
  }
  
  async onSubmit(e) {
    e.preventDefault();
    let { errors, isValid } = this.validateInput();

    if (isValid) {
      this.setState({ errors: {}, isLoading: true });
      let res = await this.props.createToken(this.state.username, this.state.password);

      if (res.token) {
        this.context.router.push('/');
      } else {
        this.setState({ 
          errors: this.apiErrorsToState(res.errors), 
          isLoading: false 
        });
      }
    } else {
      this.setState({ errors });
    }
  }
  
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  apiErrorsToState(errors) {
    let output = {};
    
    for (let e of errors) {
      output[e.field] = e.detail;
    }
    
    return output;
  }

  validateInput() {
    let { username, password } = this.state,
      errors = {},
      isValid = true;

    if (isNull(username)) {
      errors.username = FIELD_REQUIRED;
      isValid = false;
    }

    if (isNull(password)) {
      errors.password = FIELD_REQUIRED;
      isValid = false;
    }

    return { errors, isValid };
  }
  
  getFieldValidationState(field) {
    if (this.state[field]) {
      if (this.state.errors[field]) {
        return 'error';
      }
    }
  }
  
  render() {
    let { errors, isLoading } = this.state;
    
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <h1>Enter the Site</h1>
        
        <FormGroup validationState={this.getFieldValidationState('username')}>
          <ControlLabel>Username</ControlLabel>
          <InputGroup>
            <FormControl
              name="username"
              type="text"
              onChange={this.onChange.bind(this)}
            />
            <FormControl.Feedback />
          </InputGroup>
          {errors.username && <HelpBlock>{errors.username}</HelpBlock>}
        </FormGroup>
        
        <FormGroup validationState={this.getFieldValidationState('password')}>
          <ControlLabel>Password</ControlLabel>
          <InputGroup>
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
            bsStyle="default" 
            disabled={isLoading}
          >Log In</Button>
        </FormGroup>
      </form>  
    );
  }
}

LoginForm.propTypes = {
  createToken: React.PropTypes.func.isRequired
};

LoginForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(null, { createToken })(LoginForm);