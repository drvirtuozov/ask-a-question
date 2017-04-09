import React from 'react';
import { Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import Ask from './Ask';
import Answers from './Answers';
import NotFound from '../NotFound';
import Loading from '../Loading';
import { getUser } from '../../requests/api';
import socket from '../../socket';
import { setAnswers, addAnswerComment } from '../../actions/answers';


class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      isUserExists: null,
    };

    this.getUser();
  }

  async getUser() {
    const { username } = this.props;
    const res = await getUser(username);

    if (res.user) {
      socket.emit('room', res.user.id);
      console.log('EMITTED ROOM', res.user.id);
      this.setState({
        user: res.user,
        isUserExists: true,
      });
    } else {
      this.setState({
        isUserExists: false,
      });
    }
  }

  render() {
    const { user, isUserExists } = this.state;
    const { auth, username, answers } = this.props;
    const isMyProfile = auth.user.username === username;

    if (isUserExists === false) {
      return <NotFound />;
    } else if (!user.id) {
      return <Loading />;
    }

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
          setAnswers={this.props.setAnswers}
          isAuthenticated={auth.isAuthenticated}
          addAnswerComment={this.props.addAnswerComment}
        />
      </div>
    );
  }
}

Profile.propTypes = {
  auth: React.PropTypes.object.isRequired,
  username: React.PropTypes.string.isRequired,
  answers: React.PropTypes.array.isRequired,
  addAnswerComment: React.PropTypes.func.isRequired,
  setAnswers: React.PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { auth, answers } = state;

  return {
    auth,
    answers,
  };
}

export default connect(mapStateToProps, { setAnswers, addAnswerComment })(Profile);
