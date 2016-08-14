import {Component} from "angular2/core";
import {HttpService} from "../services/http";
import {Router, RouteParams} from "angular2/router";
import {ProfileComponent} from "./profile";

@Component({
    selector: "answers",
    providers: [HttpService],
    template: `
        <div class="container-fluid" *ngIf="answers">
          <h3 *ngIf="username != profile.username">{{ username }} has {{ answers.length }} answers:</h3>
          <h3 *ngIf="username == profile.username">You have {{ answers.length }} answers:</h3>
          <hr>
          <div class="panel panel-default" *ngFor="#answer of answers">
            <div class="panel-heading">
              <a *ngIf="answer.to" (click)="goToProfile(answer.to)">{{ answer.to }}</a>
              <span *ngIf="!answer.to">Anonymous</span>
            </div>
            <div class="panel-body">
              <h4>{{ answer.question }}</h4>
              <br>
              <p>{{ answer.text }}</p>
            </div>
          </div>
        </div>
        
        <h3 *ngIf="!answers">{{ username }} hasn't answered no one question yet</h3>
    `
})

export class AnswersComponent { 
    public answers = [];
    public username = "";
    public profile = JSON.parse(localStorage.getItem("profile"));
    
    constructor(private params: RouteParams, private http: HttpService, private router: Router) {
        this.username = this.params.get("username");
        this.getAnswers();
    }
    
    getAnswers() {
        this.http.getJSON("/api/answers/" + this.username)
            .subscribe(res => {
                this.answers = res.answers;
            }, err => {
                console.log(err);
            })
    }
    
    goToProfile(username: string) {
        this.router.navigate( ['Profile', { username: username }] );
    }
}
