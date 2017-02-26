import React from 'react';
import { Link } from 'react-router';
import { ListGroupItem } from 'react-bootstrap';


export default class Comment extends React.Component {
  render() {
    const { username, text } = this.props;

    return (
      <ListGroupItem header={<Link to={username}>{username}</Link>}>{text}</ListGroupItem>
    );
  }
}

Comment.propTypes = {
  id: React.PropTypes.number.isRequired,
  text: React.PropTypes.string.isRequired,
  username: React.PropTypes.string.isRequired,
  timestamp: React.PropTypes.number.isRequired
};