import React from 'react';
import { Link } from 'react-router';
import Moment from 'react-moment';
import moment from 'moment';
import { Panel, Button, FormGroup, FormControl } from 'react-bootstrap';
import Comments from './Comments';
import { commentAnswer } from '../../requests/api';


export default class Answer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      isActiveComments: false,
      commentText: '',
    };
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  async comment() {
    const { id, addAnswerComment } = this.props;
    const { commentText } = this.state;
    const res = await commentAnswer(id, commentText);

    if (res.comment) {
      addAnswerComment(res.comment);
      this.setState({
        commentText: '',
      });
    }
  }

  activeComments() {
    this.setState({
      isActiveComments: !this.state.isActiveComments,
    });
  }

  render() {
    const { isActiveComments, commentText } = this.state;
    const { text, timestamp, question, from, isAuthenticated, comments, likes } = this.props;

    return (
      <Panel
        header={
          <div>
            { from ? <Link to={from}>{from}</Link> : <span>Anonymous</span> }
            <small title={moment(timestamp).calendar()} className="pull-right">
              <span className="text-muted"><Moment fromNow>{timestamp}</Moment></span>
            </small>
          </div>
        }
      >
        <h4>{question}</h4>
        <p>{text}</p>
        <hr />
        <Button bsSize="small">
          <i className="fa fa-heart" aria-hidden="true" /> Like {likes && likes.length}
        </Button>
        <Button bsStyle="link" onClick={this.activeComments.bind(this)} className="pull-right">
          Comments ({(comments && comments.length) || 0})
        </Button>
        { isActiveComments &&
          <div>
            <hr />
            <Comments comments={comments} />
            { isAuthenticated ?
              <div>
                <FormGroup>
                  <FormControl
                    name="commentText"
                    value={commentText}
                    componentClass="textarea"
                    placeholder="Leave a comment..."
                    onChange={this.onChange.bind(this)}
                  />
                </FormGroup>
                <FormGroup>
                  <Button onClick={this.comment.bind(this)} disabled={!commentText}>Comment</Button>
                </FormGroup>
              </div>
              :
              <center>
                <h3><small>You need to be authenticated to leave a comment</small></h3>
              </center>
            }
          </div>
        }
      </Panel>
    );
  }
}

Answer.propTypes = {
  id: React.PropTypes.number.isRequired,
  text: React.PropTypes.string.isRequired,
  timestamp: React.PropTypes.number.isRequired,
  question: React.PropTypes.string.isRequired,
  from: React.PropTypes.string,
  comments: React.PropTypes.array,
  likes: React.PropTypes.array,
  isAuthenticated: React.PropTypes.bool.isRequired,
  addAnswerComment: React.PropTypes.func.isRequired,
};
