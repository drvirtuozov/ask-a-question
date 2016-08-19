import React from 'react';
import { connect } from 'react-redux';

export default function(ComposedComponent) {
  class Authenticate extends React.Component {
    componentWillMount() {
      if (!this.props.isAuthenticated) {
        //this.context.router.push('/'); there's no context
        this.props.history.push('/'); // temporary fix
      }
    }
    
    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated) {
        //this.context.router.push('/');
        this.props.history.push('/'); // temporary fix
      }
    }
    
    render() {
      return (
        <ComposedComponent {...this.props} />  
      );
    }
  }
  
  Authenticate.propsType = {
    isAuthenticated: React.PropTypes.bool.isRequired
  };
  
  Authenticate.contextType = {
    router: React.PropTypes.object.isRequired
  };
  
  function mapStateToProps(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated
    };
  }
  
  return connect(mapStateToProps)(Authenticate);
}