import {Http, Headers} from "angular2/http";
import {Injectable} from "angular2/core";
import "rxjs/add/operator/map";


@Injectable()
export class HttpService {
    
    constructor(private _http: Http) {
        
    }
    
    postJSON(link: string, body: Object) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        if (localStorage.getItem("id_token")) {
            headers.append("Authorization", "Bearer " + localStorage.getItem("id_token"));
        }
        
        return this._http.post(link, JSON.stringify(body), {headers: headers})
            .map(res => res.json());
    }
    
    getJSON(link: string) {
        var headers = new Headers();
        if (localStorage.getItem("id_token")) {
            headers.append("Authorization", "Bearer " + localStorage.getItem("id_token"));
        }
        
        return this._http.get(link, {headers: headers})
            .map(res => res.json());
    }
}
