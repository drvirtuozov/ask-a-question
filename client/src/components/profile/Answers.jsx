import React from 'react';
import Answer from './Answer';
import { getAnswers } from '../../requests/api';


export default class Answers extends React.Component {
  constructor(props) {
    super(props);
    this.getAnswers();
  }

  async getAnswers() {
    const { userId, setAnswers } = this.props;
    const res = await getAnswers(userId);

    if (res.answers) {
      setAnswers(res.answers);
    }
  }

  render() {
    const { answers, isMyProfile, username, isAuthenticated, addAnswerComment } = this.props;

    return (
      <div>
        { answers.length ?
          <div className="container-fluid">
            <h3>{ isMyProfile ? 'You have' : `${username} has`} {answers.length} answers:</h3>
            <hr />
            {answers.map((answer) => {
              const { id, text, question, comments, likes, timestamp } = answer;
              return (
                <Answer
                  question={question.text}
                  from={question.from && question.from.username}
                  text={text}
                  timestamp={timestamp}
                  comments={comments}
                  likes={likes}
                  id={id} key={id}
                  isAuthenticated={isAuthenticated}
                  addAnswerComment={addAnswerComment}
                />
              );
            })}
          </div>
          :
          <center>
            <h3 className="text-muted">
              {isMyProfile ? 'You haven\'t' : `${username} hasn't`} answered a single question yet
            </h3>
          </center>
        }
      </div>
    );
  }
}

Answers.propTypes = {
  answers: React.PropTypes.array.isRequired,
  isMyProfile: React.PropTypes.bool.isRequired,
  username: React.PropTypes.string.isRequired,
  userId: React.PropTypes.number.isRequired,
  setAnswers: React.PropTypes.func.isRequired,
  isAuthenticated: React.PropTypes.bool.isRequired,
  addAnswerComment: React.PropTypes.func.isRequired,
};
