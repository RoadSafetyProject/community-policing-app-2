import { Http, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";

/*
  Generated class for the HttpClientProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpClientProvider {
  user: any = {
    username: "admin",
    password: "IROAD2015",
    serverUrl: "http://192.168.43.70:8080/demo/api/" //"http://roadsafety.go.tz/demo/api/"
  };
  constructor(private http: Http) {}

  get(url): Observable<any> {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + btoa(this.user.username + ":" + this.user.password)
    );
    const apiUrl = this.user.serverUrl + url;
    return this.http.get(apiUrl, { headers: headers });
  }

  post(url, data): Observable<any> {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + btoa(this.user.username + ":" + this.user.password)
    );
    const apiUrl = this.user.serverUrl + url;
    return this.http.post(apiUrl, data, {
      headers: headers
    });
  }
}
