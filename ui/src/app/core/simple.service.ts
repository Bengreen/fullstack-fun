import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SimpleService {

  private configUrl = environment.configUrl + '/config';
  private graphQlUrl = '/backend/doo/graphql';

  constructor(private http: HttpClient) { }

  getConfig() {
    return this.http.get(this.configUrl);
  }

  getGraphQl() {
    return this.http.get(this.graphQlUrl);
  }
}
