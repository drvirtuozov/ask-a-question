import React from 'react';
import { Link } from 'react-router';


export default class Comment extends React.Component {
  render() {
    const { username, text } = this.props;

    return (
      <div>
        <Link to={username}>{username}</Link>: {text}
      </div>
    );
  }
}

Comment.propTypes = {
  id: React.PropTypes.number.isRequired,
  text: React.PropTypes.string.isRequired,
  username: React.PropTypes.string.isRequired,
  timestamp: React.PropTypes.number.isRequired
};