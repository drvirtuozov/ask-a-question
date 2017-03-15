import React from 'react';
import { connect } from 'react-redux';
import Ask from './Ask';
import Answers from './Answers';
import NotFound from '../NotFound';
import Loading from '../Loading';
import { Panel } from 'react-bootstrap';
import { getUser } from '../../requests/api';
import socket from '../../socket';
import { setAnswers } from '../../actions/answers';


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
    let { username } = this.props,
      res = await getUser(username);

    if (res.user) {
      socket.emit('room', res.user.id);
      console.log('EMITTED ROOM', res.user.id)
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
      { auth, username, answers, setAnswers, answerComments } = this.props,
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
          { !isMyProfile && <Ask userId={user.id} isAuthenticated={auth.isAuthenticated} username={username} /> }
          <Answers 
            isMyProfile={isMyProfile} 
            username={username} 
            userId={user.id}
            answers={answers}
            setAnswers={setAnswers}
            isAuthenticated={auth.isAuthenticated}
            answerComments={answerComments}
          /> 
        </div> 
      );
    }
  }
}

Profile.propTypes = {
  auth: React.PropTypes.object.isRequired,
  username: React.PropTypes.string.isRequired,
  answerComments: React.PropTypes.array.isRequired
};

function mapStateToProps(state) {
  let { auth, answers, answerComments } = state;

  return {
    auth,
    answers,
    answerComments
  };
}

export default connect(mapStateToProps, { setAnswers })(Profile);