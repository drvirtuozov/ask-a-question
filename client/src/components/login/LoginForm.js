import React from 'react';
import { connect } from 'react-redux';
import TextFormField from '../common/TextFormField';
import { FIELD_REQUIRED } from '../../../../server/src/shared/formErrors';
import { login } from '../../actions/authActions';


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
  
  onSubmit(e) {
    e.preventDefault();
    
    let { errors, isValid } = this.validateInput();
    
    if (isValid) {
      this.setState({ errors: {}, isLoading: true });
      this.props.login(this.state.username, this.state.password)
        .then(() => {
          this.context.router.push('/');
        })
        .catch(err => {
          this.setState({ errors: err.data.result.errors, isLoading: false });
        });
      
    } else {
      this.setState({ errors });
    }
  }
  
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  validateInput() {
    let data = this.state,
      errors = {};
    
    if (!data.username) {
      errors.username = FIELD_REQUIRED;
    }
    
    if (!data.password) {
      errors.password = FIELD_REQUIRED;
    }
  
    return {
      errors,
      isValid: Object.keys(errors).length ? false : true
    };
  }
  
  render() {
    let { username, password, errors, isLoading } = this.state;
    
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <h1>Enter the Site</h1>
        
        <TextFormField 
          field="username"
          label="Username or Email"
          value={username}
          error={errors.username}
          onChange={this.onChange.bind(this)}
        />
        
        <TextFormField
          type="password"
          field="password"
          label="Password"
          value={password}
          error={errors.password}
          onChange={this.onChange.bind(this)}
        />
        
        <div className="form-group">
          <button className="btn btn-primary btn-lg" disabled={isLoading}>Log In</button>
        </div>
      </form>  
    );
  }
}

LoginForm.propTypes = {
  login: React.PropTypes.func.isRequired
};

LoginForm.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(null, { login })(LoginForm);