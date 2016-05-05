import {Component} from "angular2/core";
import {AnswersComponent} from "./answers";
import {AskComponent} from "./ask";
import {HttpService} from "../services/http";
import {Router, RouteParams} from "angular2/router";

@Component({
    selector: "profile",
    directives: [AnswersComponent, AskComponent],
    template: `
        <div class="panel panel-default">
          <div class="panel-body">
            <h2>Profile</h2>
            <hr>
            <p>Some info</p>
          </div>
        </div>
        <ask *ngIf="user.username != profile.username"></ask>
        <answers></answers>
    `
})

export class ProfileComponent { 
    public user = {};
    public profile = JSON.parse(localStorage.getItem("profile"));
    
    constructor(private http: HttpService, private params: RouteParams) {
        this.getProfile();
    }
    
    getProfile() {
        this.http.getJSON("/api/user/" + this.params.get("username"))
            .subscribe(res => {
                this.user = res.user;
            }, err => {
                console.log(err);
            })
    }
}
