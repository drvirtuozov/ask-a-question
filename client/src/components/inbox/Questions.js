import React from 'react';
import { connect } from 'react-redux';
import Question from './Question';
import findIndex from 'lodash/findIndex';
import { getQuestions } from '../../requests/api';
import { addQuestion, addQuestions, setQuestions } from '../../actions/questions';


class Questions extends React.Component {
  constructor(props) {
    super(props);

    this.setQuestions();
  }

  async setQuestions() {
    let res = await getQuestions();
    this.props.setQuestions(res.questions);
  }
  
  render() {
    let { questions } = this.props;
    
    return (
      <div className="container-fluid">
        {questions.length ? 
          <div>
            <h3>There are {questions.length} questions especially for you:</h3>
            <hr />
            {questions.map(question => {
              return <Question 
                key={question.id}
                id={question.id}
                from={question.from ? question.from.username : null}
                text={question.text} 
                timestamp={question.timestamp} 
              />;
            })}
          </div> 
          : 
          <h3>You haven't received a single question yet.</h3>
        }
      </div>  
    );
  }
}

Questions.propTypes = {
  questions: React.PropTypes.array.isRequired,
  addQuestion: React.PropTypes.func.isRequired,
  addQuestions: React.PropTypes.func.isRequired,
  setQuestions: React.PropTypes.func.isRequired,
  replyQuestion: React.PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    questions: state.questions
  };
}

export default connect(mapStateToProps, { 
  addQuestion, addQuestions, setQuestions
})(Questions);