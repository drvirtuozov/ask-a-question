import React from 'react';
import { Link } from 'react-router';
import Moment from 'react-moment';
import moment from 'moment';
import { Panel, Button, FormGroup, FormControl } from 'react-bootstrap';
import Comments from './Comments';
import findIndex from 'lodash/findIndex';


export default class Answer extends React.Component {
  constructor(props) {
    const { id, likes, setAnswerLikes, setAnswerState, auth } = props;
    super(props);
    setAnswerLikes(id, likes && likes.length);

    if (auth.isAuthenticated && likes && findIndex(likes, { id: auth.user.id }) !== -1) {
      setAnswerState(id, {
        isLiked: true,
      });
    }
  }

  onChange(e) {
    this.props.setAnswerState(this.props.id, {
      [e.target.name]: e.target.value,
    });
  }

  async comment() {
    const { id, addAnswerComment, commentAnswer, state, setAnswerState } = this.props;
    const res = await commentAnswer(id, state.commentText);

    if (res.comment) {
      addAnswerComment(id, res.comment);
      setAnswerState(id, {
        commentText: '',
      });
    }
  }

  showComments() {
    this.props.setAnswerState(this.props.id, {
      isActiveComments: !this.props.state.isActiveComments,
    });
  }

  async like() {
    if (this.props.state.isLiked) {
      this.props.unlikeAnswer(this.props.id);
    } else {
      this.props.likeAnswer(this.props.id);
    }

    this.props.setAnswerState(this.props.id, {
      isLiked: !this.props.state.isLiked,
    });
  }

  render() {
    const { id, text, timestamp, question, from, comments, state, auth } = this.props;
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
        <Button
          bsSize="small"
          onClick={this.like.bind(this)}
          disabled={!auth.isAuthenticated}
          bsStyle={
            state.isLiked ? 'primary' : 'default'
          }
        >
          <i className="fa fa-heart" aria-hidden="true" /> Like {this.props.answersLikes[id] || ''}
        </Button>
        <Button bsStyle="link" onClick={this.showComments.bind(this)} className="pull-right">
          Comments ({(comments && comments.length) || 0})
        </Button>
        { state.isActiveComments &&
          <div>
            <hr />
            <Comments comments={comments} />
            { auth.isAuthenticated ?
              <div>
                <FormGroup>
                  <FormControl
                    name="commentText"
                    value={state.commentText}
                    componentClass="textarea"
                    placeholder="Leave a comment..."
                    onChange={this.onChange.bind(this)}
                  />
                </FormGroup>
                <FormGroup>
                  <Button onClick={this.comment.bind(this)} disabled={!state.commentText}>
                    Comment
                  </Button>
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

Answer.defaultProps = {
  state: {
    isActiveComments: false,
    commentText: '',
    isLiked: false,
  },
};

Answer.propTypes = {
  id: React.PropTypes.number.isRequired,
  text: React.PropTypes.string.isRequired,
  timestamp: React.PropTypes.number.isRequired,
  question: React.PropTypes.string.isRequired,
  from: React.PropTypes.string,
  comments: React.PropTypes.array,
  likes: React.PropTypes.array,
  commentAnswer: React.PropTypes.func.isRequired,
  addAnswerComment: React.PropTypes.func.isRequired,
  state: React.PropTypes.object,
  setAnswerState: React.PropTypes.func.isRequired,
  auth: React.PropTypes.object.isRequired,
  answersLikes: React.PropTypes.object.isRequired,
  setAnswerLikes: React.PropTypes.func.isRequired,
  likeAnswer: React.PropTypes.func.isRequired,
  unlikeAnswer: React.PropTypes.func.isRequired,
};
