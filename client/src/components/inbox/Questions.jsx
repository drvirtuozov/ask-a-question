import React from 'react';
import { connect } from 'react-redux';
import Question from './Question';
import {
  incrementQuestionsCount, decrementQuestionsCount,
} from '../../actions/questionsCount';


function Questions(props) {
  const { questions, questionsCount } = props;

  return (
    <div>
      {questionsCount ?
        <div>
          {questionsCount === 1 ?
            <h3>There's a question especially for you:</h3>
            :
            <h3>There are {questionsCount} questions especially for you:</h3>
          }
          <hr />
          {questions.map(question => (
            <Question
              key={question.id}
              id={question.id}
              from={question.from ? question.from.username : null}
              text={question.text}
              timestamp={question.timestamp}
              decrementQuestionsCount={props.decrementQuestionsCount}
              incrementQuestionsCount={props.incrementQuestionsCount}
            />
          ))}
        </div>
        :
        <center>
          <h3 className="text-muted">You haven't received a single question yet.</h3>
        </center>
      }
    </div>
  );
}

Questions.propTypes = {
  questions: React.PropTypes.array.isRequired,
  questionsCount: React.PropTypes.number.isRequired,
  incrementQuestionsCount: React.PropTypes.func.isRequired,
  decrementQuestionsCount: React.PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    questions: state.questions,
    questionsCount: state.questionsCount,
  };
}

export default connect(mapStateToProps, {
  incrementQuestionsCount, decrementQuestionsCount,
})(Questions);
