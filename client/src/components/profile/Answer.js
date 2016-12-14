import React from 'react';


class Answer extends React.Component {
  goToProfile(e) {
    
  }
  
  render() {
    
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          {this.props.to ? 
            <a onClick={this.goToProfile.bind(this)}>{this.props.to}</a>
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
  question: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
  to: React.PropTypes.string
};

export default Answer;