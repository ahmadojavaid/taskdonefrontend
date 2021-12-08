/*
 * @file: tabular.service.ts
 * @description:
 * @date: 19/11/2018
 * @author: Saloni Malhotra
 * */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject,Subscription, Subject } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TabularService {

  /* Service URL of taskboard Service */
  baseUrl = environment.baseUrl;
  private uToken = localStorage.getItem('userToken');
  private getTemplateProjectUrl = this.baseUrl + '/getBoards';
  private getBoardNameUrl = this.baseUrl + '/getBoardName';
  private createTemplateProjectUrl = this.baseUrl + '/createBoardTemplates';
  private updateTemplateProjectUrl = this.baseUrl + '/updateBoardTemplates';
  private getGroupsDataTabularUrl = this.baseUrl + '/fetchGroupsTabular';
  private createGroupsDataTabularUrl = this.baseUrl + '/createTabularGroups';
  private deleteGroupsDataTabularUrl = this.baseUrl + '/deleteTabularGroups';

  constructor(private _httpClient: HttpClient) {}

   /* Get Templates & Project Boards Service in Tabular */
    getTemplateProject(data):Observable<any>{
      data['token'] = this.uToken;
      return this._httpClient.post(this.getTemplateProjectUrl,data);
    }

    /* Get Board Name from Board ID */
    getBoardNameTabular(data):Observable<any>{
      data['token'] = this.uToken;
      return this._httpClient.post(this.getBoardNameUrl,data);
    }

    /* Create Template & Project Board Service in Tabular */
    createTemplateProject(data):Observable<any>{
      return this._httpClient.post(this.createTemplateProjectUrl,data);
    }

    /* Create Template & Project Board Service in Tabular */
    updateTemplateProject(data):Observable<any>{
      return this._httpClient.post(this.updateTemplateProjectUrl,data);
    }

    /* Get Groups Data in Tabular */
    getGroupDataTabular(data):Observable<any>{
      data['token'] = this.uToken;
      return this._httpClient.post(this.getGroupsDataTabularUrl,data);
    }

    /* Create Group Data in Tabular */
    createGroupDataTabular(data):Observable<any>{
      return this._httpClient.post(this.createGroupsDataTabularUrl,data);
    }

    /* Delete Group Data in Tabular */
    deleteGroupDataTabular(data):Observable<any>{
      data['token'] = this.uToken;
      return this._httpClient.post(this.deleteGroupsDataTabularUrl,data);
    }
}
