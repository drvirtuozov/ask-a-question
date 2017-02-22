import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { login, logout } from '../actions/auth';
import { 
  Nav, NavItem, MenuItem, NavDropdown, Navbar, 
  Form, FormGroup, FormControl, Button, Label 
} from 'react-bootstrap';

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      password: '',
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
  
  login() {
    this.setState({ errors: {}, isLoading: true });
    this.props.login(this.state.username, this.state.password)
      .then(() => {
        this.context.router.push('/');
        this.setState({ isLoading: false });
      })
      .catch(err => {
        this.setState({ errors: err.data.result.errors, isLoading: false });
      });
  }
  
  getValidationState() {
    let errors = this.state.errors;
    
    if (Object.keys(errors).length) {
      return {
        username: errors.username ? "error" : "success",
        password: errors.password ? "error" : "success"
      };
    }
    
    return {};
  }
  
  render() {
    let { isLoading } = this.state, 
      { auth, questionsCount } = this.props,
      { isAuthenticated, user } = auth,
      userMenu = (
        <Nav pullRight>
          <NavItem eventKey={1}><Label>{ questionsCount }</Label></NavItem>
          <NavDropdown eventKey={3} title={user.username} id="basic-nav-dropdown">
            <MenuItem eventKey={3.1}>Your page</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={this.logout.bind(this)} eventKey={3.3}>Log Out</MenuItem>
          </NavDropdown>
        </Nav>
      ),
      guestMenu = (
        <Navbar.Form pullRight>
          <FormGroup validationState={this.getValidationState().username}>
            <FormControl onChange={this.onChange.bind(this)} name="username" type="text" placeholder="Username" />
          </FormGroup>
          {' '}
          <FormGroup validationState={this.getValidationState().password}>
            <FormControl onChange={this.onChange.bind(this)} name="password" type="password" placeholder="Password" />
          </FormGroup>
          {' '}
          <Button onClick={this.login.bind(this)} disabled={isLoading}>Log In</Button>
        </Navbar.Form>
      );
    
    return (
      <Navbar>
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
    questionsCount: state.questions.length
  };
}

export default connect(mapStateToProps, { logout, login })(NavigationBar);