import React from 'react';
import { connect } from 'react-redux';
import { reply } from '../../actions/answerActions';
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

  reply(answer) {
    let index = findIndex(this.state.questions, { _id: answer.id });
    
    this.props.reply(answer)
      .then(res => {
        this.setState({
          question: this.state.questions.splice(index, 1)
        });
      });
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
                reply={this.reply.bind(this)}
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
  reply: React.PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    questions: state.questions
  };
}

export default connect(mapStateToProps, { reply, addQuestion, addQuestions, setQuestions })(Questions);