import React from 'react';
import { Link } from 'react-router';
import Moment from 'react-moment';
import { Button, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import moment from 'moment';


export default class Question extends React.Component {
  onChange(e) {
    const { id, setQuestionState } = this.props;

    setQuestionState(id, {
      [e.target.name]: e.target.value,
    });
  }

  async reply() {
    const { id, answerQuestion, decrementQuestionsCount, setQuestionState, state } = this.props;
    setQuestionState(id, { isLoading: true });
    const res = await answerQuestion(id, state.answer);

    if (!res.errors) {
      setQuestionState(id, { isAnswered: true });
      decrementQuestionsCount();
    } else {
      setQuestionState(id, { isLoading: false });
      this.props.addFlashMessage({
        type: 'error',
        text: res.errors[0].detail,
      });
    }
  }

  async delete() {
    const { id, deleteQuestion, decrementQuestionsCount, incrementQuestionsCount, setQuestionState } = this.props;
    setQuestionState(id, { isDeleted: true });
    decrementQuestionsCount();
    const res = await deleteQuestion(id);

    if (res.errors) {
      setQuestionState(id, { isDeleted: false });
      incrementQuestionsCount();
    }
  }

  async restore() {
    const { id, restoreQuestion, incrementQuestionsCount, decrementQuestionsCount, setQuestionState } = this.props;
    setQuestionState(id, { isDeleted: false });
    incrementQuestionsCount();
    const res = await restoreQuestion(id);

    if (res.errors) {
      setQuestionState(id, { isDeleted: true });
      decrementQuestionsCount();
    }
  }

  render() {
    const { from, text, timestamp, state } = this.props;

    if (state.isAnswered) {
      return <Panel><center>The question has been answered</center></Panel>;
    } else if (state.isDeleted) {
      return (<Panel>
        <center>The question has been deleted. <a onClick={this.restore.bind(this)}>Restore</a></center>
      </Panel>);
    }

    return (
      <Panel
        header={
          <div>
            {from ? <Link to={from}>{from}</Link> : <span>Anonymous</span>}
            <small title={moment(timestamp).calendar()}>
              <span className="text-muted">&nbsp;<Moment fromNow>{timestamp}</Moment></span>
            </small>
            <button onClick={this.delete.bind(this)} className="close"><span>&times;</span></button>
          </div>
        }
      >
        <FormGroup>
          <ControlLabel>{text}</ControlLabel>
          <FormControl
            name="answer"
            componentClass="textarea"
            placeholder="Type your answer..."
            onChange={this.onChange.bind(this)}
            value={state.answer}
          />
        </FormGroup>
        <Button onClick={this.reply.bind(this)} disabled={state.isLoading || !state.answer}>Reply</Button>
      </Panel>
    );
  }
}

Question.defaultProps = {
  from: '',
  state: {
    answer: '',
    isLoading: false,
    isAnswered: false,
    isDeleted: false,
  },
};

Question.propTypes = {
  id: React.PropTypes.number.isRequired,
  from: React.PropTypes.string,
  text: React.PropTypes.string.isRequired,
  timestamp: React.PropTypes.number.isRequired,
  decrementQuestionsCount: React.PropTypes.func.isRequired,
  incrementQuestionsCount: React.PropTypes.func.isRequired,
  answerQuestion: React.PropTypes.func.isRequired,
  deleteQuestion: React.PropTypes.func.isRequired,
  restoreQuestion: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired,
  state: React.PropTypes.object,
  setQuestionState: React.PropTypes.func.isRequired,
};
