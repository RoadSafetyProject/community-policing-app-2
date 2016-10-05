import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class HttpClient {
  //private IROADURL = "http://roadsafety.go.tz/demo/api/";
  private IROADURL = "http://192.168.42.95:8082/demo/api/";
  //private IROADURL = "demo/api/";
  constructor(private http: Http) {
    this.http = http;
  }

  createAuthorizationHeader(headers:Headers,options?) {
    headers.append('Authorization', 'Basic ' +
      btoa('admin:IROAD2015'));
    if(options){
      for(let key in options){
        headers.append(key, options[key]);
      }
    }
  }

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(this.IROADURL + url, {
      headers: headers
    });
  }

  post(url, data,options?) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers,options);
    return this.http.post(this.IROADURL + url, data, {
      headers: headers
    });
  }
}
