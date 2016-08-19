import React from 'react';
import { connect } from 'react-redux';
import { getQuestions } from '../actions/questionsActions';

class Questions extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      questions: []
    };
    
    props.getQuestions()
      .then(res => {
        this.setState({
          questions: res.data.questions
        });
      });
  }
  
  render() {
    return (
      <h1>Loading...</h1>  
    );
  }
  
  /*render() {
    if (this.state.questions.length) {
      var questions = ''
    }
    
    return(
      <div class="container-fluid" *ngIf="questions">
        <h3>Questions especially for you:</h3>
          <hr>
          <div class="panel panel-default" *ngFor="#question of questions; #i = index">
            <div class="panel-heading">
              <a *ngIf="question.from" (click)="goToProfile(question.from)">{{ question.from }}</a>
              <span *ngIf="!question.from">Anonymous</span>
            </div>
            <div class="panel-body">
              <p>{{ question.text }}</p>
              
              <textarea rows="3" class="form-control" placeholder="Type your answer..." #textarea></textarea>
              <button class="btn btn-default navbar-btn" (click)="reply(textarea.value, i)">Reply</button>
            </div>
          </div>
      </div>
      
      <h3 *ngIf="!questions">You haven't received no one question yet.</h3>  
    );
  }*/
}

Questions.propTypes = {
  getQuestions: React.PropTypes.func.isRequired
};

export default connect(null, { getQuestions })(Questions);