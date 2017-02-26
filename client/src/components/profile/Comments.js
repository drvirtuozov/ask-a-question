import React from 'react';
import Comment from './Comment';
import { ListGroup } from 'react-bootstrap';


export default class Comments extends React.Component {
  render() {
    let { comments } = this.props;

    return (
      <ListGroup>
        {comments.map(comment => {
          let { id, user, text, timestamp } = comment;
          return <Comment id={id} username={user.username} text={text} timestamp={timestamp} key={id} />;
        })}
      </ListGroup>
    );
  }
}

Comments.propTypes = {
  comments: React.PropTypes.array.isRequired
};