import React from 'react';
import moment from 'moment';
import { replyQuestion } from '../../requests/api';
import { Button, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { isNull } from 'validator';


export default class Question extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      moment: '',
      answer: '',
      isLoading: false,
      isAnswered: false
    };
  }
  
  goToProfile() {
    this.context.router.push(this.props.from);
  }
  
  getMoment() {
    let timestamp = this.props.timestamp,
      date = new Date(timestamp).toDateString(),
      now = new Date(Date.now()).toDateString();
    
    this.setState({
      moment: date === now ? moment(timestamp).fromNow() : moment(timestamp).calendar()
    });
  }
  
  async reply() {
    this.setState({ isLoading: true });
    let { id } = this.props,
      { answer } = this.state,
      res = await replyQuestion(id, answer);
    this.setState({ isAnswered: true });
  }
  
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  render() {
    const { answer, isLoading, isAnswered } = this.state,
      { from, text } = this.props;
    
    if (isAnswered) {
      return (<Panel><center>The question has been answered</center></Panel>);
    } else {
      return (
        <Panel 
          header={
            <span>
              from {from ? <a onClick={this.goToProfile.bind(this)}>{this.props.from} </a> : <span>Anonymous </span>}
              {this.state.moment} 
            </span>
          }
          footer={
            <Button onClick={this.reply.bind(this)} disabled={isLoading || isNull(answer)}>Reply</Button>
          }
        >
          <FormGroup controlId="formControlsTextarea">
            <ControlLabel>{text}</ControlLabel>
            <FormControl 
              name="answer" 
              componentClass="textarea" 
              placeholder="Type your answer..."
              onChange={this.onChange.bind(this)}
            />
          </FormGroup>
        </Panel>
      );
    }
  }
}

Question.propTypes = {
  id: React.PropTypes.number.isRequired,
  from: React.PropTypes.string,
  text: React.PropTypes.string.isRequired,
  timestamp: React.PropTypes.number.isRequired
};

Question.contextTypes = {
  router: React.PropTypes.object.isRequired
};