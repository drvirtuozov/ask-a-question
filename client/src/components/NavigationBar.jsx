import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
  Nav, NavItem, MenuItem, NavDropdown, Navbar,
  FormGroup, FormControl, Button, Label, Col,
} from 'react-bootstrap';
import { login, logout } from '../actions/auth';
import apiErrorsToState from '../utils/apiErrorsToState';


class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
      errors: {},
      isLoading: false,
    };
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  getValidationState() {
    const { errors } = this.state;

    if (Object.keys(errors).length) {
      return {
        username: errors.username ? 'error' : null,
        password: errors.password ? 'error' : null,
      };
    }

    return {};
  }

  async login() {
    this.setState({ errors: {}, isLoading: true });
    const { username, password } = this.state;
    const res = await this.props.login(username, password);

    if (res.token) {
      this.setState({
        username: null,
        password: null,
        isLoading: false,
      });
    } else {
      this.setState({
        errors: apiErrorsToState(res.errors),
        isLoading: false,
      });
    }
  }

  logout() {
    this.props.logout();
  }

  goToProfile() {
    this.context.router.push(this.props.auth.user.username);
  }

  render() {
    const { username, password, isLoading } = this.state;
    const { auth, questionsCount } = this.props;
    const { isAuthenticated, user } = auth;
    const validationState = this.getValidationState();
    const isValid = username && password;
    const userMenu = (
      <Nav pullRight>
        <NavItem eventKey={1}><Label>{questionsCount}</Label></NavItem>
        <NavDropdown eventKey={3} title={user.username} id="basic-nav-dropdown">
          <MenuItem onClick={this.goToProfile.bind(this)} eventKey={3.1}>Your page</MenuItem>
          <MenuItem divider />
          <MenuItem onClick={this.logout.bind(this)} eventKey={3.3}>Log Out</MenuItem>
        </NavDropdown>
      </Nav>
    );
    const guestMenu = (
      <Navbar.Form pullRight>
        <FormGroup validationState={validationState.username}>
          <FormControl onChange={this.onChange.bind(this)} name="username" type="text" placeholder="Username" />
        </FormGroup>
        {' '}
        <FormGroup validationState={validationState.password}>
          <FormControl onChange={this.onChange.bind(this)} name="password" type="password" placeholder="Password" />
        </FormGroup>
        {' '}
        <Button onClick={this.login.bind(this)} disabled={isLoading || !isValid}>Log In</Button>
      </Navbar.Form>
    );

    return (
      <Navbar fixedTop={true} fluid={true}>
        <Col lg={8} lgOffset={2}>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/" className="navbar-brand">Ask a Question</Link>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Collapse>
            <div className="container-fluid">
              { isAuthenticated ? userMenu : guestMenu }
            </div>
          </Navbar.Collapse>
        </Col>
      </Navbar>
    );
  }
}

NavigationBar.propTypes = {
  auth: React.PropTypes.object.isRequired,
  logout: React.PropTypes.func.isRequired,
  login: React.PropTypes.func.isRequired,
  questionsCount: React.PropTypes.number.isRequired,
};

NavigationBar.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    questionsCount: state.questionsCount,
  };
}

export default connect(mapStateToProps, { logout, login })(NavigationBar);
