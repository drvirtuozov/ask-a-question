import React from 'react';
import { Link } from 'react-router';

export default class NavigationBar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">Ask a Question</Link>
          </div>
          
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/login">Log In</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}