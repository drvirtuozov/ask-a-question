import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { login, logout } from '../actions/auth';
import { 
  Nav, NavItem, MenuItem, NavDropdown, Navbar, 
  Form, FormGroup, FormControl, Button, Label 
} from 'react-bootstrap';
import apiErrorsToState from '../utils/apiErrorsToState';


class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: null,
      password: null,
      errors: {},
      isLoading: false
    };
  }
  
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  logout() {
    this.props.logout();
  }
  
  async login() {
    this.setState({ errors: {}, isLoading: true });
    let { username, password } = this.state,
      res = await this.props.login(username, password);

    if (res.token) {
      this.context.router.push('/');
      this.setState({
        username: null,
        password: null, 
        isLoading: false
      });
    } else {
      this.setState({ 
        errors: apiErrorsToState(res.errors), 
        isLoading: false 
      });
    }
  }
  
  getValidationState() {
    let { errors } = this.state;
    
    if (Object.keys(errors).length) {
      return {
        username: errors.username ? 'error' : null,
        password: errors.password ? 'error' : null
      };
    }
    
    return {};
  }
  
  render() {
    let { username, password, isLoading } = this.state, 
      { auth, questionsCount } = this.props,
      { isAuthenticated, user } = auth,
      validationState = this.getValidationState(),
      isValid = username && password,
      userMenu = (
        <Nav pullRight>
          <NavItem eventKey={1}><Label>{questionsCount}</Label></NavItem>
          <NavDropdown eventKey={3} title={user.username} id="basic-nav-dropdown">
            <MenuItem eventKey={3.1}>Your page</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={this.logout.bind(this)} eventKey={3.3}>Log Out</MenuItem>
          </NavDropdown>
        </Nav>
      ),
      guestMenu = (
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
      </Navbar>
    );
  }
}

NavigationBar.propTypes = {
  auth: React.PropTypes.object.isRequired,
  logout: React.PropTypes.func.isRequired,
  login: React.PropTypes.func.isRequired,
  questionsCount: React.PropTypes.number.isRequired
};

NavigationBar.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    questionsCount: state.questionsCount
  };
}

export default connect(mapStateToProps, { logout, login })(NavigationBar);