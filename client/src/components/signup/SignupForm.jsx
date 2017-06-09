import React from 'react';
import { Link } from 'react-router';
import { isNull, isEmail, isAlpha } from 'validator';
import {
    FormControl, FormGroup, ControlLabel,
    HelpBlock, InputGroup, Button, Col,
} from 'react-bootstrap';
import {
  USERNAME_TAKEN, EMAIL_TAKEN, FIELD_REQUIRED,
  INVALID_PASSWORD, INVALID_USERNAME, INVALID_EMAIL,
} from '../../helpers/formErrors';
import { apiErrorsToState } from '../../helpers/utils';


export default class SignupForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      errors: {},
      isLoading: false,
    };
  }

  onChange(e) {
    const field = e.target.name;
    const value = e.target.value;
    const error = this.checkFieldError(field, value);
    const errors = this.state.errors;

    if (error) {
      errors[field] = error;
    } else {
      delete errors[field];
    }

    this.setState({
      [field]: value,
      errors,
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    const res = await this.props.signup(this.state);

    if (res.token) {
      this.props.addFlashMessage({
        type: 'success',
        text: 'You signed up successfully. Welcome!',
      });

      this.context.router.push('/');
    } else {
      this.setState({
        errors: apiErrorsToState(res.errors),
        isLoading: false,
      });
    }
  }

  getFieldValidationState(field) {
    if (this.state[field]) {
      if (this.state.errors[field]) {
        return 'error';
      }

      return 'success';
    }
  }

  async checkUserExists(e) {
    const field = e.target.name;
    const value = e.target.value;
    const errors = this.state.errors;

    if (value !== '' && !this.checkFieldError(field, value)) {
      if (await this.props.isUserExists(value)) {
        errors[field] = (field === 'username' ? USERNAME_TAKEN : EMAIL_TAKEN);
      } else {
        delete errors[field];
      }

      this.setState({ errors });
    }
  }

  checkFieldError(field, value) {
    let output = null;
    const validators = {
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
      },
    };

    validators[field]();
    return output;
  }

  render() {
    const { errors, isLoading } = this.state;

    return (
      <Col lg={8} lgOffset={2}>
        <center>
          <h2>Don't have an account?</h2>
          <h3>Let's create one!</h3>
        </center>
        <Col lg={8} lgOffset={2}>
          <form onSubmit={this.onSubmit.bind(this)}>
            <FormGroup validationState={this.getFieldValidationState('username')}>
              <ControlLabel>Username</ControlLabel>
              <InputGroup>
                <InputGroup.Addon><i className="fa fa-user" aria-hidden="true" /></InputGroup.Addon>
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
                <InputGroup.Addon><i className="fa fa-at" aria-hidden="true" /></InputGroup.Addon>
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
                <InputGroup.Addon><i className="fa fa-lock" aria-hidden="true" /></InputGroup.Addon>
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
              <center>
                <Button
                  type="submit"
                  bsSize="large"
                  bsStyle="success"
                  disabled={isLoading || Object.keys(errors).length}
                >Sign Up</Button>
                <br />
                <hr />
                <small>Already have an account? <Link to="/login">Log In</Link></small>
              </center>
            </FormGroup>
          </form>
        </Col>
      </Col>
    );
  }
}

SignupForm.propTypes = {
  signup: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  isUserExists: React.PropTypes.func.isRequired,
};

SignupForm.contextTypes = {
  router: React.PropTypes.object.isRequired,
};
