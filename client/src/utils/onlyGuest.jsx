import React from 'react';
import { connect } from 'react-redux';


export default function (ComposedComponent) {
  class Guest extends React.Component {
    componentWillMount() {
      if (this.props.isAuthenticated) {
        this.context.router.push('/');
      }
    }

    componentWillUpdate(nextProps) {
      if (nextProps.isAuthenticated) {
        this.context.router.push('/');
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }

  Guest.propTypes = {
    isAuthenticated: React.PropTypes.bool.isRequired,
  };

  Guest.contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  function mapStateToProps(state) {
    return {
      isAuthenticated: state.auth.isAuthenticated,
    };
  }

  return connect(mapStateToProps)(Guest);
}
