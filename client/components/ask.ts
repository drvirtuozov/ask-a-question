import {Component, Injector} from "angular2/core";
import {HttpService} from "../services/http";
import {Router, RouteParams, CanActivate, ComponentInstruction} from "angular2/router";

@Component({
    selector: "ask",
    providers: [HttpService],
    template: `
        <div class="container-fluid">
          <h3>Ask a question:</h3>
          <hr>
          <div class="panel panel-default">
            <div class="panel-body">
              <textarea rows="3" class="form-control" placeholder="Type your ask..." [(ngModel)]="text"></textarea>
              <button class="btn btn-default navbar-btn" (click)="ask(text)">Reply</button>
            </div>
          </div>
        </div>
    `
})


export class AskComponent {
    public text = "";
    
    constructor(private params: RouteParams, private http: HttpService) {
        
    }
    
    ask(text: string) {
        this.http.postJSON("/api/questions", {text: text, username: this.params.get("username")})
            .subscribe(res => {
                if (res.ok) this.text = "";
            }, err => {
                console.log(err);
            });
    }
}