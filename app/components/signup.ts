import {Component} from "angular2/core";
import {CanActivate} from "angular2/router";
import {tokenNotExpired, JwtHelper} from "angular2-jwt";
import {Router} from "angular2/router";

@Component({
    selector: "sign-up",
    template: `
        Sign Up
    `
})

export class SignUpComponent { 
    
    constructor(private router: Router) {
        if (tokenNotExpired()) {
            this.router.navigate(["Questions"]);
        }
    }
}
