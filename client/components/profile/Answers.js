import React from 'react';
import { connect } from 'react-redux';
import Answer from './Answer';
import { getAnswers } from '../../actions/answerActions';


class Answers extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      answers: []
    };
    
    props.getAnswers(props.username)
      .then(res => {
        this.setState({
          answers: res.data.answers
        });
      });
  }
  
  render() {
    let { myProfile, username } = this.props,
      answers = this.state.answers;
    
    return (
      <div>
        { answers.length ?
        <div className="container-fluid">
          <h3>{ myProfile ? 'You have' : username} {answers.length} answers:</h3>
          <hr />
          {answers.map(answer => {
            return <Answer question={answer.question} text={answer.text} to={answer.to} key={answer._id} />;
          })}
        </div>
        :
        <h3>{myProfile ? 'You haven\'t' : username + ' hasn\'t'} answered a single question yet</h3>}
      </div>
    );
  }
}

Answers.propTypes = {
  myProfile: React.PropTypes.bool.isRequired,
  username: React.PropTypes.string.isRequired,
  auth: React.PropTypes.object.isRequired,
  getAnswers: React.PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps, { getAnswers })(Answers);