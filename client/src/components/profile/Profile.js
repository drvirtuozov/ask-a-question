import React from 'react';
import { connect } from 'react-redux';
import Ask from './Ask';
import Answers from './Answers';
import NotFound from '../NotFound';
import Loading from '../Loading';
import { Panel } from 'react-bootstrap';
import { getUser } from '../../requests/api';


class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      isUserExists: null
    };

    this.getUser();
  }

  async getUser() {
    let { username } = this.props;
    let res = await getUser(username);

    if (res.user) {
      this.setState({
        user: res.user,
        isUserExists: true
      });
    } else {
      this.setState({
        isUserExists: false
      });
    }
  }

  render() {
    let { user, isUserExists } = this.state,
      { auth, username } = this.props,
      isMyProfile = auth.user.username === username;
    
    if (isUserExists === false) {
      return <NotFound />;
    } else if (!user.id) {
      return <Loading />;
    } else {
      return (
        <div>
          <Panel>
            <h2>{username}</h2>
            <hr />
            <p>Some info</p>
          </Panel>
          { !isMyProfile && <Ask /> }
          <Answers isMyProfile={isMyProfile} username={username} userId={user.id} /> 
        </div> 
      );
    }
  }
}

Profile.propTypes = {
  auth: React.PropTypes.object.isRequired,
  username: React.PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps)(Profile);