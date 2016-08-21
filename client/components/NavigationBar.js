import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logout, login } from '../actions/authActions';
import classnames from 'classnames';

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
  
  logout(e) {
    e.preventDefault();
    this.props.logout();
  }
  
  login() {
    this.setState({ errors: {}, isLoading: true });
    this.props.login(this.state.username, this.state.password)
      .then(() => {
        this.context.router.push('/');
      })
      .catch(err => {
        this.setState({ errors: err.data.result.errors, isLoading: false });
      });
  }
  
  render() {
    let { errors, isLoading } = this.state, 
      { isAuthenticated } = this.props.auth,
      userMenu = (
        <ul className="nav navbar-nav navbar-right">
          <li><a href="#" onClick={this.logout.bind(this)}>Log Out</a></li>
        </ul>
      ),
      guestMenu = (
        <form className="navbar-form navbar-right">
          <div className={classnames("form-group", { "has-error": errors.username })}>
            <input 
              onChange={this.onChange.bind(this)} 
              type="text" 
              name="username" 
              placeholder="Username" 
              className="form-control"
            />
          </div>
          <div className={classnames("form-group", { "has-error": errors.password })}>
            <input 
              onChange={this.onChange.bind(this)} 
              type="password" 
              name="password" 
              placeholder="Password" 
              className="form-control"
            />
          </div>
          <button onClick={this.login.bind(this)} className="btn btn-default" disabled={isLoading}>Log In</button>
        </form>
      );
    
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">Ask a Question</Link>
          </div>
          
          <div className="collapse navbar-collapse">
            { isAuthenticated ? userMenu : guestMenu }
          </div>
        </div>
      </nav>
    );
  }
}

NavigationBar.propTypes = {
  auth: React.PropTypes.object.isRequired,
  logout: React.PropTypes.func.isRequired,
  login: React.PropTypes.func.isRequired
};

NavigationBar.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps, { logout, login })(NavigationBar);