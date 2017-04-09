import React from 'react';
import { Link } from 'react-router';
import Moment from 'react-moment';
import { Button, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import moment from 'moment';
import { isNull } from 'validator';
import { replyQuestion, deleteQuestion, restoreQuestion } from '../../requests/api';


export default class Question extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answer: '',
      isLoading: false,
      isAnswered: false,
      isDeleted: false,
    };
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  async reply() {
    this.setState({ isLoading: true });
    const { id } = this.props;
    const { answer } = this.state;
    await replyQuestion(id, answer);
    this.setState({ isAnswered: true });
    this.props.decrementQuestionsCount();
  }

  async delete() {
    const { id } = this.props;
    this.setState({ isDeleted: true });
    this.props.decrementQuestionsCount();
    const res = await deleteQuestion(id);

    if (res.errors) {
      this.setState({ isDeleted: false });
      this.props.incrementQuestionsCount();
    }
  }

  async restore() {
    const { id } = this.props;
    this.setState({ isDeleted: false });
    this.props.incrementQuestionsCount();
    const res = await restoreQuestion(id);

    if (res.errors) {
      this.setState({ isDeleted: true });
      this.props.decrementQuestionsCount();
    }
  }

  render() {
    const { answer, isLoading, isAnswered, isDeleted } = this.state;
    const { from, text, timestamp } = this.props;

    if (isAnswered) {
      return <Panel><center>The question has been answered</center></Panel>;
    } else if (isDeleted) {
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
          />
        </FormGroup>
        <Button onClick={this.reply.bind(this)} disabled={isLoading || isNull(answer)}>Reply</Button>
      </Panel>
    );
  }
}

Question.propTypes = {
  id: React.PropTypes.number.isRequired,
  from: React.PropTypes.string,
  text: React.PropTypes.string.isRequired,
  timestamp: React.PropTypes.number.isRequired,
  decrementQuestionsCount: React.PropTypes.func.isRequired,
  incrementQuestionsCount: React.PropTypes.func.isRequired,
};
