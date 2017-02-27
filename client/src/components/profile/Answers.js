import React from 'react';
import Answer from './Answer';
import { getAnswers } from '../../requests/api';


export default class Answers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answers: []
    };

    this.getAnswers();
  }

  async getAnswers() {
    let res = await getAnswers(this.props.userId);
    
    if (res.answers) {
      this.setState({
        answers: res.answers
      });
    }
  }

  render() {
    let { answers } = this.state,
      { isMyProfile, username } = this.props;
    
    return (
      <div>
        { answers.length ?
          <div className="container-fluid">
            <h3>{ isMyProfile ? 'You have' : `${username} has`} {answers.length} answers:</h3>
            <hr />
            {answers.map(answer => {
              let { id, text, question, comments, likes, timestamp } = answer;
              return <Answer 
                question={question.text} 
                from={question.from} 
                text={text} 
                timestamp={timestamp} 
                comments={comments}
                likes={likes}
                id={id} key={id} />;
            })}
          </div>
          :
          <center>
            <h3 className="text-muted">
              {isMyProfile ? 'You haven\'t' : `${username} hasn\'t`} answered a single question yet
            </h3>
          </center>
        }
      </div>
    );
  }
}

Answers.propTypes = {
  isMyProfile: React.PropTypes.bool.isRequired,
  username: React.PropTypes.string.isRequired,
  userId: React.PropTypes.number.isRequired
};