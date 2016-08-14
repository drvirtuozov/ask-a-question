import {Component} from "angular2/core";
import {QuestionsComponent} from "./components/questions";
import {SignUpComponent} from "./components/signup";
import {ProfileComponent} from "./components/profile";
import {tokenNotExpired, JwtHelper} from "angular2-jwt";
import {HttpService} from "./services/http";
import {Router, RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: "app",
    directives: [QuestionsComponent, SignUpComponent, ROUTER_DIRECTIVES],
    providers: [HttpService],
    template: `
        <nav class="navbar navbar-default navbar-top">
          <div class="container-fluid">
            <div class="navbar-header">
              <a class="navbar-brand" (click)="goToMainPage()">Ask a Question</a>
            </div>
            
            <form class="navbar-form navbar-right" *ngIf="!isLoggedIn()">
              <input type="text" #username placeholder="Username" class="form-control"/>
              <input type="password" #password placeholder="Password" class="form-control"/>
              <button (click)="login(username.value, password.value)" *ngIf="!isLoggedIn()" class="btn btn-default">Log In</button>
            </form>
            
            
            <div class="container-fluid navbar-right" *ngIf="isLoggedIn()">
          
              <div class="container-fluid">
                <ul class="nav navbar-nav">
                  <li><a href="#">Questions <span class="badge">1</span></a></li>
                  <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{ getProfile().username }} <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                      <li><a href="#">Action</a></li>
                      <li><a href="#">Another action</a></li>
                      <li><a href="#">Something else here</a></li>
                      <li role="separator" class="divider"></li>
                      <li><a href="#">Separated link</a></li>
                      <li role="separator" class="divider"></li>
                      <li><a href="#">One more separated link</a></li>
                    </ul>
                  </li>
                </ul>
                
                <button class="btn btn-default navbar-btn navbar-right" (click)="logout()">Log Out</button>
              </div>
            </div>
          </div>
        </nav>
        
        <div class="row">
          <div class="panel panel-default col-lg-10 col-lg-offset-1">
            <div class="panel-body">
              
              <router-outlet></router-outlet>
              
            </div>
          </div>
        </div>
    `
})

//<questions *ngIf="loggedIn()">Loading...</questions>
//<sign-up *ngIf="!loggedIn()">Loading...</sign-up>

@RouteConfig([
    {path: "/", name: "SignUp", component: SignUpComponent},
    {path: "/questions", name: "Questions", component: QuestionsComponent},
    {path: "/user/:username", name: "Profile", component: ProfileComponent}
])


export class App {
    jwtHelper: JwtHelper = new JwtHelper();
    
    constructor(private http: HttpService, private router: Router) {
        
    }
    
    login(username: string, password: string) {
        this.http.postJSON("/api/login", {username: username, password: password})
            .subscribe(res => {
                var data = this.jwtHelper.decodeToken(res.token);
                localStorage.setItem("id_token", res.token);
                localStorage.setItem("profile", JSON.stringify({username: data.username}));
        
                //console.log(this.jwtHelper.decodeToken(res.token));
                //console.log(this.jwtHelper.getTokenExpirationDate(res.token));
                //console.log(this.jwtHelper.isTokenExpired(res.token));
                
                this.router.navigate(["Questions"]);
            }, err => {
                console.log(err);
            })
    }
    
    logout() {
        localStorage.removeItem("profile");
        localStorage.removeItem("id_token");
        
        this.router.navigate(["SignUp"]);
    }
    
    isLoggedIn() {
        return tokenNotExpired();
    }
    
    getProfile() {
        return JSON.parse(localStorage.getItem("profile"));
    }
    
    goToMainPage() {
        if (tokenNotExpired()) {
            this.router.navigate(["Questions"]);
        } else {
            this.router.navigate(["SignUp"]);
        }
    }
}
