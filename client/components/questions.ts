import {Component, EventEmitter} from "angular2/core";
import {tokenNotExpired, JwtHelper} from "angular2-jwt";
import {CanActivate} from "angular2/router";
import {HttpService} from "../services/http";
import {ROUTER_DIRECTIVES, Router, RouteConfig} from "angular2/router";
import {ProfileComponent} from "./profile";

@Component({
    selector: "questions",
    //directives: [ROUTER_DIRECTIVES],
    providers: [HttpService],
    //outputs: ["questionsChanged"],
    template: `
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
    `
})

//@CanActivate(() => tokenNotExpired())

export class QuestionsComponent { 
    public questions = [];
    
    constructor(private http: HttpService, private router: Router) {
        if (!tokenNotExpired()) {
            this.router.navigate(["SignUp"]);
        } else {
            this.getQuestions();
        }
    }
    
    getQuestions() {
        this.http.getJSON("/api/questions")
            .subscribe(res => {
                this.questions = res.questions;
            }, err => {
                console.log(err);
            })
    }
    
    reply(text: string, i: number) {
        var question = this.questions[i];
        
        console.log(JSON.stringify({text: text, id: question._id}));
        this.http.postJSON("/api/answers", {text: text, id: question._id})
            .subscribe(res => {
                if (res.ok) {
                    this.questions.splice(i, 1);
                }
            }, err => {
                console.log(err);
            });
    }
    
    goToProfile(username: string) {
        this.router.navigate( ['Profile', { username: username }] );
    }
    
}
