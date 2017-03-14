import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Panel, Button, FormGroup, FormControl } from 'react-bootstrap';
import Comments from './Comments';
import { commentAnswer } from '../../requests/api';
import Moment from 'react-moment'
import moment from 'moment';
import findIndex from 'lodash/findIndex';


export default class Answer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      isActiveComments: false,
      commentText: '',
      comments: props.comments || []
    };
  }

  componentWillReceiveProps(nextProps) {
    let { id, comments } = this.state,
      { answerComments } = nextProps,
      comment = answerComments[answerComments.length - 1];
    
    if (comment && comment.answer.id == id) {
      if (findIndex(comments, { id: comment.id }) === -1) {
        comments.push(comment);
        this.setState({
          comments
        });
      }
    }
  }

  activeComments() {
    this.setState({
      isActiveComments: !this.state.isActiveComments
    });
  }

  async comment() {
    let { id } = this.props,
      { comments, commentText } = this.state,
      res = await commentAnswer(id, commentText);
    
    if (res.comment) {
      comments.push(res.comment);
      this.setState({
        comments,
        commentText: ''
      });
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    let { isActiveComments, commentText, comments } = this.state, 
      { id, text, timestamp, question, from, isAuthenticated, likes } = this.props;

    return (
      <Panel header={
        <div>
          { from ? <Link to={from}>{from}</Link> : <span>Anonymous</span> }
          <small title={moment(timestamp).calendar()} className="pull-right">
            <span className="text-muted"><Moment fromNow>{timestamp}</Moment></span>
          </small>
        </div>
      }>
        <h4>{question}</h4>
        <p>{text}</p>
        <hr />
        <Button bsSize="small">
          <i className="fa fa-heart" aria-hidden="true"></i> Like {likes && likes.length}
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
                    onChange={this.onChange.bind(this)} />
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
  answerComments: React.PropTypes.array.isRequired
};
