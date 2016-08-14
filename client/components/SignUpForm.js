import React from 'react';

export default class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      username: '',
      email: '',
      password: ''
    };
  }
  
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  onSubmit(e) {
    e.preventDefault();
    this.props.userSignupRequest(this.state);
  }
  
  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <h1>Join our community!</h1>
        
        <div className="form-group">
          <label className="control-label">Username</label>
          <input
            onChange={this.onChange.bind(this)}
            value={this.state.username} 
            type="text" 
            name="username" 
            className="form-control">
          </input>
        </div>
        
        <div className="form-group">
          <label className="control-label">Email</label>
          <input
            onChange={this.onChange.bind(this)}
            value={this.state.email} 
            type="text" 
            name="email" 
            className="form-control">
          </input>
        </div>
        
        <div className="form-group">
          <label className="control-label">Password</label>
          <input
            onChange={this.onChange.bind(this)}
            value={this.state.password} 
            type="password" 
            name="password" 
            className="form-control">
          </input>
        </div>
        
        <div className="form-group">
          <button className="btn btn-primary btn-lg">Sign Up</button>
        </div>
      </form>
    );
  }
}

SignUpForm.propTypes = {
  userSignupRequest: React.PropTypes.func.isRequired
};