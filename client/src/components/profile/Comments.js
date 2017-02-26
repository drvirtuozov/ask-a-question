import React from 'react';
import Comment from './Comment';


export default class Comments extends React.Component {
  render() {
    let { comments } = this.props;

    return (
      <div>
        {comments.map(comment => {
          let { id, user, text, timestamp } = comment;
          return <Comment id={id} username={user.username} text={text} timestamp={timestamp} key={id} />;
        })}
      </div>
    );
  }
}

Comments.propTypes = {
  comments: React.PropTypes.array.isRequired
};