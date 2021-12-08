/*
* @file:mainconfig.service.ts,
* @description: Mail services,
* @date:12/24/2018,
* @author:Saloni Malhotra
*/


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject,Subscription, Subject } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailconfigService {
  baseUrl = environment.baseUrl;
  private uToken = localStorage.getItem('userToken');
  private mailConfigureUrl = this.baseUrl + '/mailConfigure';

  constructor(private _httpClient:HttpClient) { }

  /* Mail Configure Service */
  mailConfigure(data):Observable<any>{
    data['userToken'] = this.uToken;
    return this._httpClient.post(this.mailConfigureUrl,data);
  }

}
