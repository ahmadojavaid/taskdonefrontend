import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';

import { FuseUtils } from '@fuse/utils';

import { Mail } from 'app/main/apps/mail/mail.model';

@Injectable()
export class MailService implements Resolve<any>
{
    mails: Mail[];
    selectedMails: Mail[];
    currentMail: Mail;
    searchText = '';

    folders: any[];
    filters: any[];
    labels: any[];
    routeParams: any;

    onMailsChanged: BehaviorSubject<any>;
    onSelectedMailsChanged: BehaviorSubject<any>;
    onCurrentMailChanged: BehaviorSubject<any>;
    onFoldersChanged: BehaviorSubject<any>;
    onFiltersChanged: BehaviorSubject<any>;
    onLabelsChanged: BehaviorSubject<any>;
    onSearchTextChanged: BehaviorSubject<any>;
    baseUrl = environment.baseUrl;
    private uToken = localStorage.getItem('userToken');
    private mailConfigureAccountUrl = this.baseUrl + '/getConfigureMails';
    private getMailFoldersUrl = this.baseUrl + '/getMailFolders';
    private getMailListingByFolderUrl = this.baseUrl + '/getMailList';
    private composeMailUrl = this.baseUrl + '/compose-mail';
    private draftMailUrl = this.baseUrl + '/draft-mail';

    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.selectedMails = [];
        this.onMailsChanged = new BehaviorSubject([]);
        this.onSelectedMailsChanged = new BehaviorSubject([]);
        this.onCurrentMailChanged = new BehaviorSubject([]);
        this.onFoldersChanged = new BehaviorSubject([]);
        this.onFiltersChanged = new BehaviorSubject([]);
        this.onLabelsChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new BehaviorSubject('');
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        this.routeParams = route.params;
    }

   /* Get all folders */
    getFolders(data): Promise<any>
    {
        data['userToken'] = this.uToken
        return new Promise((resolve, reject) => {
          this._httpClient.post(this.getMailFoldersUrl,data)
              .subscribe((response: any) => {
                  this.folders = response.result;
                  this.folders.map(val => {
                    val.handle = val.name.replace(/ +/g, "").toLowerCase();
                    return val
                  })
                  this.onFoldersChanged.next(this.folders);
                  resolve(this.folders);
              }, reject);
        });
    }

    /* get Mail List by Folder */
    getMailsListByFolder(data): Promise<any[]>{
          data['userToken'] = this.uToken
           return new Promise((resolve, reject) => {
               this._httpClient.post(this.getMailListingByFolderUrl,data)
                   .subscribe((mails: any) => {
                      let mailResult = mails.result;
                      let mailData = [];
                      for (let key in mailResult) {
                          if (mailResult.hasOwnProperty(key)) {
                              mailData.push(mailResult[key]);
                          }
                    }
                     this.mails = mailData.map(mail => {
                         return mail;
                     });
                       this.mails = FuseUtils.filterArrayByString(this.mails, this.searchText);
                       this.onMailsChanged.next(this.mails);
                       resolve(this.mails);
                   }, reject);
                });
          }

    /* Get Mails Account Listing By SM */
      getMailAccount():Observable<any>{
        let data = {
          'userToken': this.uToken
        }
        return this._httpClient.post(this.mailConfigureAccountUrl,data);
      }

    /* Compose Mails */
    addComposeMails(data):Observable<any>{
      return this._httpClient.post(this.composeMailUrl,data);
    }

    /* Draft Mails */
    addDraftMails(data):Observable<any>{
      return this._httpClient.post(this.draftMailUrl,data);
    }
}
