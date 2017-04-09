import React from 'react';
import {
  Panel, FormGroup, FormControl,
  ControlLabel, Button, Checkbox, ButtonToolbar,
} from 'react-bootstrap';
import { createQuestion } from '../../requests/api';


export default class Ask extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAsked: false,
      isLoading: false,
      question: '',
      anonymously: false,
      status: 'default',
    };
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  setAnonymously() {
    this.setState({
      anonymously: !this.state.anonymously,
    });
  }

  setAsked() {
    this.setState({
      isAsked: !this.state.isAsked,
      status: 'default',
    });
  }

  async ask() {
    this.setState({
      isLoading: true,
      status: 'default',
    });

    try {
      const { userId } = this.props;
      const { question, anonymously } = this.state;
      await createQuestion(userId, question, { anonymously });

      this.setState({
        question: '',
        isLoading: false,
        isAsked: !this.state.isAsked,
      });
    } catch (e) {
      this.setState({
        status: 'danger',
        isLoading: false,
      });
    }
  }

  render() {
    const { isAuthenticated, username } = this.props;
    const { isAsked, isLoading, anonymously, question, status } = this.state;

    if (isAsked) {
      return (
        <Panel bsStyle="success">
          <center>
            <span>Success! <strong>{username}</strong> has just received your question.</span>
            &nbsp;
            <a onClick={this.setAsked.bind(this)}>Ask another question</a>
          </center>
        </Panel>
      );
    }

    return (
      <Panel bsStyle={status}>
        <FormGroup>
          <ControlLabel>Ask me whatever you want:</ControlLabel>
          <FormControl
            name="question"
            value={question}
            componentClass="textarea"
            placeholder="Ask a question..."
            onChange={this.onChange.bind(this)}
          />
        </FormGroup>
        <ButtonToolbar>
          <Button onClick={this.ask.bind(this)} disabled={!question || isLoading}>Ask</Button>
          {isAuthenticated && <Checkbox checked={anonymously} inline onChange={this.setAnonymously.bind(this)}>Ask anonymously</Checkbox>}
        </ButtonToolbar>
      </Panel>
    );
  }
}

Ask.propTypes = {
  userId: React.PropTypes.number.isRequired,
  isAuthenticated: React.PropTypes.bool.isRequired,
  username: React.PropTypes.string.isRequired,
};
