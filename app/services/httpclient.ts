import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class HttpClient {
  //private IROADURL = "http://roadsafety.go.tz/demo/api/";
  private IROADURL = "http://192.168.42.149:8082/demo/api/";
  //private IROADURL = "demo/api/";
  constructor(private http: Http) {
    this.http = http;
  }

  createAuthorizationHeader(headers:Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('admin:IROAD2015'));
  }

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(this.IROADURL + url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(this.IROADURL + url, data, {
      headers: headers
    });
  }
}
