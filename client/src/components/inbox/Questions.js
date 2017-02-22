import React from 'react';
import { connect } from 'react-redux';
import { getQuestions } from '../../actions/apiRequests';
import { reply } from '../../actions/answerActions';
import Question from './Question';
import findIndex from 'lodash/findIndex';

class Questions extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      questions: []
    };

    this.updateQuestions();
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

  async updateQuestions() {
    this.setState({
      questions: (await getQuestions()).questions
    });
  }
  
  render() {
    let { questions } = this.state;
    console.log(questions)
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
  getQuestions: React.PropTypes.func.isRequired,
  reply: React.PropTypes.func.isRequired
};

export default connect(null, { getQuestions, reply })(Questions);