import React from 'react';
import { connect } from 'react-redux';
import Question from './Question';
import findIndex from 'lodash/findIndex';
import { getQuestions } from '../../requests/api';
import { addQuestion, addQuestions, setQuestions } from '../../actions/questions';
import { 
  incrementQuestionsCount, decrementQuestionsCount, 
  setQuestionsCount 
} from '../../actions/questionsCount';


class Questions extends React.Component {
  constructor(props) {
    super(props);

    this.setQuestions();
  }

  async setQuestions() {
    let res = await getQuestions();
    this.props.setQuestions(res.questions);
    this.props.setQuestionsCount(res.questions.length);
  }
  
  render() {
    let { questions, questionsCount, decrementQuestionsCount } = this.props;
    
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
            {questions.map(question => {
              return <Question 
                key={question.id}
                id={question.id}
                from={question.from ? question.from.username : null}
                text={question.text} 
                timestamp={question.timestamp}
                decrementQuestionsCount={decrementQuestionsCount}
              />;
            })}
          </div> 
          : 
          <h3><center>You haven't received a single question yet.</center></h3>
        }
      </div>  
    );
  }
}

Questions.propTypes = {
  questions: React.PropTypes.array.isRequired,
  questionsCount: React.PropTypes.number.isRequired,
  addQuestion: React.PropTypes.func.isRequired,
  addQuestions: React.PropTypes.func.isRequired,
  setQuestions: React.PropTypes.func.isRequired,
  incrementQuestionsCount: React.PropTypes.func.isRequired,
  decrementQuestionsCount: React.PropTypes.func.isRequired,
  setQuestionsCount: React.PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    questions: state.questions,
    questionsCount: state.questionsCount
  };
}

export default connect(mapStateToProps, { 
  addQuestion, addQuestions, setQuestions, incrementQuestionsCount, 
  decrementQuestionsCount, setQuestionsCount
})(Questions);