import React from 'react';
import Answer from './Answer';


export default function Answers(props) {
  const { answers, isMyProfile, username } = props;
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
                commentAnswer={props.commentAnswer}
                addAnswerComment={props.addAnswerComment}
                state={answer.state}
                setAnswerState={props.setAnswerState}
                auth={props.auth}
                answersLikes={props.answersLikes}
                setAnswerLikes={props.setAnswerLikes}
                likeAnswer={props.likeAnswer}
                unlikeAnswer={props.unlikeAnswer}
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
  commentAnswer: React.PropTypes.func.isRequired,
  addAnswerComment: React.PropTypes.func.isRequired,
  setAnswerState: React.PropTypes.func.isRequired,
  auth: React.PropTypes.object.isRequired,
  answersLikes: React.PropTypes.object.isRequired,
  setAnswerLikes: React.PropTypes.func.isRequired,
  likeAnswer: React.PropTypes.func.isRequired,
  unlikeAnswer: React.PropTypes.func.isRequired,
};
