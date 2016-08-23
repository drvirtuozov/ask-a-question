import React from 'react';
import { connect } from 'react-redux';

class Index extends React.Component {
  componentDidMount() {
    let { isAuthenticated } = this.props.auth;
    isAuthenticated ? this.context.router.push('/inbox') : this.context.router.push('/signup');
  }
  
  render() {
    return(
      <h1>Loading...</h1>  
    );
  }
}

Index.propTypes = {
  auth: React.PropTypes.object.isRequired
};

Index.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps)(Index);