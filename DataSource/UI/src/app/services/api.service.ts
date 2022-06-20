import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly apiUrl = "http://127.0.0.1:8000/action/";

  constructor(private http : HttpClient) { }

  performAction(val:any){
    return this.http.post(this.apiUrl,val);
  }
  
}
