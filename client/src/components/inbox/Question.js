import React from 'react';
import moment from 'moment';


class Question extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      moment: "",
      answer: ""
    };
  }
  
  goToProfile() {
    this.context.router.push(this.props.from);
  }
  
  getMoment() {
    let timestamp = this.props.timestamp,
      date = new Date(timestamp).toDateString(),
      now = new Date(Date.now()).toDateString();
    
    this.setState({
      moment: date === now ? moment(timestamp).fromNow() : moment(timestamp).calendar()
    });
  }
  
  reply() {
    this.props.reply({
      _id: this.props.id,
      text: this.state.answer
    });
  }
  
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  render() {
    let { from, text } = this.props;
    
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <span>
            from {from ? <a onClick={this.goToProfile.bind(this)}>{this.props.from} </a> : <span>Anonymous </span>}
            {this.state.moment} 
          </span>
        </div>
        <div className="panel-body">
          <p>{text}</p>
          <textarea
            name="answer"
            onChange={this.onChange.bind(this)} 
            rows="3" 
            className="form-control" 
            placeholder="Type your answer...">
          </textarea>
          <button className="btn btn-default navbar-btn" onClick={this.reply.bind(this)}>Reply</button>
        </div>
      </div>  
    );
  }
}

Question.propTypes = {
  id: React.PropTypes.number.isRequired,
  from: React.PropTypes.string,
  text: React.PropTypes.string.isRequired,
  timestamp: React.PropTypes.number.isRequired,
  reply: React.PropTypes.func.isRequired
};

Question.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Question;