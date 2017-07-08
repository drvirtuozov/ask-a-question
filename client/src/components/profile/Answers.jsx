import React from 'react';
import Answer from './Answer';


export default function Answers(props) {
  const { answers, isMyProfile, username,
    isAuthenticated, commentAnswer, addAnswerComment, setAnswerState } = props;
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
                id={id}
                key={id}
                isAuthenticated={isAuthenticated}
                commentAnswer={commentAnswer}
                addAnswerComment={addAnswerComment}
                state={answer.state}
                setAnswerState={setAnswerState}
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

Answers.propTypes = {
  answers: React.PropTypes.array.isRequired,
  isMyProfile: React.PropTypes.bool.isRequired,
  username: React.PropTypes.string.isRequired,
  isAuthenticated: React.PropTypes.bool.isRequired,
  commentAnswer: React.PropTypes.func.isRequired,
  addAnswerComment: React.PropTypes.func.isRequired,
  setAnswerState: React.PropTypes.func.isRequired,
};
