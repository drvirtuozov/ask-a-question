import React from 'react';
import classnames from 'classnames';

const SignupFormField = ({ field, value, label, error, type, onChange, checkUserExists }) => {
  return (
    <div className={classnames("form-group", { "has-error": error })}>
      <label className="control-label">{ label }</label>
      <input
        onChange={ onChange }
        onBlur={ checkUserExists }
        value={ value } 
        type={ type } 
        name={ field } 
        className="form-control">
      </input>
      {error && <span className="help-block">{ error }</span>}
    </div>  
  );
};

SignupFormField.propTypes = {
  field: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  error: React.PropTypes.string,
  type: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  checkUserExists: React.PropTypes.func
};

SignupFormField.defaultProps = {
  type: 'text'
};

export default SignupFormField;