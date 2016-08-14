import React from 'react';
import classnames from 'classnames';

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
    this.setState({ [e.target.name]: e.target.value });
  }
  
  onSubmit(e) {
    e.preventDefault();
    this.setState({ errors: {}, isLoading: true });
    this.props.userSignupRequest(this.state)
      .catch(res => {
        this.setState({
          errors: res,
          isLoading: false
        });
      });
  }
  
  render() {
    const { errors } = this.state;
    
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <h1>Join our community!</h1>
        
        <div className={classnames("form-group", { "has-error": errors.username })}>
          <label className="control-label">Username</label>
          <input
            onChange={this.onChange.bind(this)}
            value={this.state.username} 
            type="text" 
            name="username" 
            className="form-control">
          </input>
          {errors.username && <span className="help-block">{ errors.username }</span>}
        </div>
        
        <div className={classnames("form-group", { "has-error": errors.email })}>
          <label className="control-label">Email</label>
          <input
            onChange={this.onChange.bind(this)}
            value={this.state.email} 
            type="text" 
            name="email" 
            className="form-control">
          </input>
        </div>
        
        <div className={classnames("form-group", { "has-error": errors.password })}>
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
          <button disabled={this.state.isLoading} className="btn btn-primary btn-lg">Sign Up</button>
        </div>
      </form>
    );
  }
}

SignupForm.propTypes = {
  userSignupRequest: React.PropTypes.func.isRequired
};