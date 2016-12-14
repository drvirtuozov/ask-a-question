import React from 'react';
import { connect } from 'react-redux';
import Ask from './Ask';
import Answers from './Answers';

class Profile extends React.Component {
  render() {
    let myProfile = this.props.auth.user.username === this.props.routeParams.splat,
      username = this.props.routeParams.splat;
    
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-body">
            <h2>Profile</h2>
            <hr />
            <p>Some info</p>
          </div>
        </div>
        { myProfile ? "" : <Ask /> }
        <Answers myProfile={myProfile} username={username}/> 
      </div> 
    );
  }
}

Profile.propTypes = {
  auth: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps)(Profile);