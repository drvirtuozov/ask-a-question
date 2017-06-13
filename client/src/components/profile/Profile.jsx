import React from 'react';
import { Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import Ask from './Ask';
import Answers from './Answers';
import NotFound from '../../containers/NotFound';
import Loading from '../../containers/Loading';
import { getUser } from '../../actions/user';
import { setAnswers, addAnswerComment } from '../../actions/answers';
import { createQuestion } from '../../actions/questions';


class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      isUserExists: null,
    };
  }

  componentDidMount() {
    this.fetchUser();
  }

  async fetchUser() {
    const { username } = this.props;
    const res = await this.props.getUser(username);

    if (res.user) {
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
        {
          !isMyProfile &&
            <Ask
              userId={user.id}
              isAuthenticated={auth.isAuthenticated}
              username={username}
              createQuestion={this.props.createQuestion}
            />
        }
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
  getUser: React.PropTypes.func.isRequired,
  createQuestion: React.PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { auth, answers } = state;

  return {
    auth,
    answers,
  };
}

export default connect(mapStateToProps, {
  setAnswers, addAnswerComment, getUser, createQuestion,
})(Profile);
