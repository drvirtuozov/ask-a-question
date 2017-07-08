import React from 'react';
import { Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import Ask from './Ask';
import Answers from './Answers';
import NotFound from '../../containers/NotFound';
import Loading from '../../containers/Loading';
import { getUser } from '../../actions/user';
import { getAnswers, setAnswers, commentAnswer, addAnswerComment, setAnswerState } from '../../actions/answers';
import { createQuestion } from '../../actions/questions';
import { setCurrentProfile } from '../../actions/profile';


class Profile extends React.Component {
  async componentDidMount() {
    await this.fetchUser();
    this.getAndSetAnswers();
  }

  componentWillReceiveProps(nextProps) {

  }

  async componentDidUpdate() {
    console.log("props", this.props.username, "state", this.props.profile.user.username)
    if (this.props.username !== this.props.profile.user.username) {
      this.props.setAnswers([]);
      this.props.setCurrentProfile({});
      await this.fetchUser();
      this.getAndSetAnswers();
    }
  }

  async fetchUser() {
    const { username } = this.props;
    const res = await this.props.getUser(username);

    if (res.user) {
      this.props.setCurrentProfile(res.user);
    } else {
      this.props.setCurrentProfile({});
    }
  }

  async getAndSetAnswers() {
    const res = await this.props.getAnswers(this.props.profile.user.id);
    console.log('ANSWEEERS', res)
    if (res.answers) {
      this.props.setAnswers(res.answers);
    }
  }

  render() {
    const { auth, username, answers, profile } = this.props;
    const isMyProfile = auth.user.username === username;

    if (profile.isUserExists === false) {
      return <NotFound />;
    } else if (!profile.user.id) {
      return <Loading />;
    }

    return (
      <div>
        <Panel>
          <h2>{username}</h2>
          <hr />
          <p>Some info</p>
        </Panel>
        {
          !isMyProfile &&
            <Ask
              userId={profile.user.id}
              isAuthenticated={auth.isAuthenticated}
              username={username}
              createQuestion={this.props.createQuestion}
            />
        }
        <Answers
          answers={answers}
          isMyProfile={isMyProfile}
          username={username}
          isAuthenticated={auth.isAuthenticated}
          commentAnswer={this.props.commentAnswer}
          addAnswerComment={this.props.addAnswerComment}
          setAnswerState={this.props.setAnswerState}
        />
      </div>
    );
  }
}

Profile.propTypes = {
  auth: React.PropTypes.object.isRequired,
  username: React.PropTypes.string.isRequired,
  answers: React.PropTypes.array.isRequired,
  commentAnswer: React.PropTypes.func.isRequired,
  addAnswerComment: React.PropTypes.func.isRequired,
  getAnswers: React.PropTypes.func.isRequired,
  setAnswers: React.PropTypes.func.isRequired,
  getUser: React.PropTypes.func.isRequired,
  createQuestion: React.PropTypes.func.isRequired,
  profile: React.PropTypes.object.isRequired,
  setCurrentProfile: React.PropTypes.func.isRequired,
  setAnswerState: React.PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { auth, answers, profile } = state;

  return {
    auth,
    answers,
    profile,
  };
}

export default connect(mapStateToProps, {
  getAnswers,
  setAnswers,
  commentAnswer,
  addAnswerComment,
  getUser,
  createQuestion,
  setCurrentProfile,
  setAnswerState,
})(Profile);
