import React from 'react';
import {
  FormControl, FormGroup, ControlLabel,
  HelpBlock, InputGroup, Button, Col,
} from 'react-bootstrap';
import { isNull } from 'validator';
import { FIELD_REQUIRED } from '../../../../server/src/shared/formErrors';


export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      errors: {},
      isLoading: false,
    };
  }

  async onSubmit(e) {
    e.preventDefault();
    const { username, password } = this.state;
    const { errors, isValid } = this.validateInput();

    if (isValid) {
      this.setState({ errors: {}, isLoading: true });
      const res = await this.props.login(username, password);

      if (res.token) {
        this.context.router.push('/');
      } else {
        this.setState({
          errors: this.apiErrorsToState(res.errors),
          isLoading: false,
        });
      }
    } else {
      this.setState({ errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  getFieldValidationState(field) {
    if (this.state[field]) {
      if (this.state.errors[field]) {
        return 'error';
      }
    }
  }

  validateInput() {
    const { username, password } = this.state;
    const errors = {};
    let isValid = true;

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

  render() {
    const { errors, isLoading } = this.state;

    return (
      <Col lg={4} lgOffset={4}>
        <h2>Enter the Site</h2>
        <form onSubmit={this.onSubmit.bind(this)}>
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

          <Button
            type="submit"
            bsSize="large"
            bsStyle="default"
            disabled={isLoading}
          >Log In
          </Button>
        </form>
      </Col>
    );
  }
}

LoginForm.propTypes = {
  login: React.PropTypes.func.isRequired,
};

LoginForm.contextTypes = {
  router: React.PropTypes.object.isRequired,
};
