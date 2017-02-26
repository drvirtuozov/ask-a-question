import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Panel, Button, FormGroup, FormControl } from 'react-bootstrap';
import Comment from './Comment';
import { commentAnswer } from '../../requests/api';


class Answer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isActiveComments: false,
      comments: props.comments || [],
      commentText: ''
    };
  }

  activeComments() {
    this.setState({
      isActiveComments: !this.state.isActiveComments
    });
  }

  async comment() {
    let { id } = this.props,
      { commentText, comments } = this.state,
      res = await commentAnswer(id, commentText);
    
    if (res.comment) {
      comments.push(res.comment);
      this.setState({
        comments: comments,
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
    let { isActiveComments, comments, commentText } = this.state, 
      { text, timestamp, question, from, isAuthenticated, likes } = this.props;

    return (
      <Panel header={from ? <Link to={from}>{from}</Link> : <span>Anonymous</span>}>
        <h4>{question}</h4>
        <p>{text}</p>
        <hr />
        <Button bsSize="small">
          <i className="fa fa-heart" aria-hidden="true"></i> Like {likes && likes.length}
        </Button>
        <Button bsStyle="link" onClick={this.activeComments.bind(this)}>
          Comments ({comments ? comments.length : 0})
        </Button>
        { isActiveComments &&
          <div>
            <hr />
            {comments && comments.map(comment => {
              let { id, user, text, timestamp } = comment;
              return <Comment id={id} username={user.username} text={text} timestamp={timestamp} key={id} />;
            })}
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
  isAuthenticated: React.PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
}

export default connect(mapStateToProps)(Answer);