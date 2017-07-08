import React from 'react';
import { ListGroup } from 'react-bootstrap';
import Comment from './Comment';


export default function Comments(props) {
  return (
    <ListGroup>
      {props.comments.map((comment) => {
        const { id, user, text, timestamp } = comment;
        return (<Comment
          id={id}
          username={user.username}
          text={text}
          timestamp={timestamp}
          key={id}
        />);
      })}
    </ListGroup>
  );
}

Comments.propTypes = {
  comments: React.PropTypes.array.isRequired,
};
