import React from 'react';


class Answer extends React.Component {
  goToProfile(e) {
    
  }
  
  render() {
    
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          {this.props.from ? 
            <a onClick={this.goToProfile.bind(this)}>{this.props.from}</a>
            :
            <span>Anonymous</span>
          }
        </div>
        <div className="panel-body">
          <h4>{this.props.question}</h4>
          <br />
          <p>{this.props.text}</p>
        </div>
      </div> 
    );
  }
}

Answer.propTypes = {
  id: React.PropTypes.number.isRequired,
  text: React.PropTypes.string.isRequired,
  timestamp: React.PropTypes.number.isRequired,
  question: React.PropTypes.string.isRequired,
};

export default Answer;