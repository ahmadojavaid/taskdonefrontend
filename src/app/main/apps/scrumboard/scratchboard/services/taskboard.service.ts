import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject,Subscription, Subject } from 'rxjs';
//import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import {TaskboardClass} from '../class/taskboard-class';
@Injectable({
  providedIn: 'root'
})

export class TaskboardService  {

  board:any;
  onBoardChanged : BehaviorSubject<any>;
  Result:any;
  dbResult:any;
  taskboardclass = new TaskboardClass();
  boardheads = this.taskboardclass.defaultBoards;
  subscription:Subscription;
  TabChanged: BehaviorSubject<any>;
  response:any;
  activityLogsChanged = new Subject<any>();
  attachmentALChanged = new Subject<any>();
  notesALChanged =  new Subject<any>();

  /*Service URL of taskboard Service by SM */
  baseUrl = environment.baseUrl;
  private uToken = localStorage.getItem('userToken');
  private getTemplateProjectUrl = this.baseUrl + 'getBoards';
  private storeAttachmentsUrl = this.baseUrl + '/attachmentstore';
  private getAttachmentsUrl = this.baseUrl + '/attachmentfetch';
  private attachmentDownloadUrl = this.baseUrl + '/attachmentdownload';
  private attachmentsDeleteUrl = this.baseUrl + '/attachmentdelete';
  private storeNotesUrl = this.baseUrl + '/notestore';
  private getNotesUrl = this.baseUrl + '/notefetch';
  private deleteNotesUrl = this.baseUrl + '/notesdelete';
  private storeCalendarUrl = this.baseUrl + '/calendarEventStore';

 constructor(
      private _httpClient: HttpClient
  ){
    this.onBoardChanged = new BehaviorSubject([]);
    this.TabChanged =  new BehaviorSubject([]);
  }


  /**
     * Get database data
     *
     * @param token
     * @returns {Promise<any>}
     */
    checkDBold(token)
    {
        console.log('service called....');
        return  this._httpClient.post(this.baseUrl+'/groups/'  + token,'');
    }

    //board name
     getBoardName(Uid): Promise<any>{
      return new Promise((resolve, reject) => {
        this._httpClient.post(this.baseUrl+'/getBoardName/' + Uid,'')

            .subscribe((response: any) => {
                this.board = response;
                this.onBoardChanged.next(this.board);
                resolve(this.board);
            }, reject);
      });
    }

    //update board name
    updateBoardName(data): Promise<any>{
      return new Promise((resolve, reject) => {
          this._httpClient.post(this.baseUrl + '/UpdateBoardName',data)
              .subscribe((response: any) => {
                  this.board = response;
                  this.onBoardChanged.next(this.board);
                  resolve(this.board);
              }, reject);
        });
    }

    //fetch board data for user
    checkDB(TId): Promise<any>{
      return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseUrl+'/groups/' + TId,'')
                .subscribe((response: any) => {
                    this.board = response;
                    this.onBoardChanged.next(this.board);
                    resolve(this.board);
                }, reject);
            });
    }

    //insert api
    insertBoardData(data): Promise<any>{
        return new Promise((resolve, reject) => {
          this._httpClient.post(this.baseUrl + '/insertGroup',data)
              .subscribe((response: any) => {
                  this.board = response;
                  this.onBoardChanged.next(this.board);
                  resolve(this.board);
              }, reject);
      });
    }

    //list of users
    getPersonlist(): Promise<any>{
      return new Promise((resolve, reject) => {
        this._httpClient.get(this.baseUrl + '/person')
            .subscribe((response: any) => {
                this.board = response;
                this.onBoardChanged.next(this.board);
                resolve(this.board);
            }, reject);
      });
    }

    //insert column and row data
    newRowColm(data): Promise<any>{
      return new Promise((resolve, reject) => {
        this._httpClient.post(this.baseUrl + '/newRowCol',data)
            .subscribe((response: any) => {
                this.board = response;
                this.onBoardChanged.next(this.board);
                resolve(this.board);
            }, reject);
      });
    }

    //update row and column data
    updateGroup(data): Promise<any>{
       return new Promise((resolve, reject) => {
        this._httpClient.post(this.baseUrl + '/UpdateGroup',data)
            .subscribe((response: any) => {
                this.board = response;
                this.onBoardChanged.next(this.board);
                resolve(this.board);
            }, reject);
      });
    }

    //status options
    statusOptions(data): Promise<any>{
        return new Promise((resolve, reject) => {
         this._httpClient.post(this.baseUrl + '/statusOption',data)
             .subscribe((response: any) => {
                 this.board = response;
                 this.onBoardChanged.next(this.board);
                 resolve(this.board);
             }, reject);
       });
     }

     getRelationalCols(boardId = 1) : Promise<any>{

       let sendDat = {'boardId' : boardId};
       let loginId = localStorage.getItem('userToken');
      return new Promise((resolve, reject) => {
        this._httpClient.post(this.baseUrl + '/colrelations/'+loginId,sendDat)
            .subscribe((response: any) => {
              this.TabChanged.next(response);
              resolve(response);
            }, reject);
        });
    }

     //submit col relation record
    relationCol_submit(loginId, sendDat): Promise<any>{
       return new Promise((resolve, reject) => {
         this._httpClient.post(this.baseUrl + '/col_relations/'  + loginId,sendDat)
           .subscribe((response: any) => {
               this.TabChanged.next(response);
               resolve(response);
             }, reject);
           });
       }

     checkRelation(col) : Promise<any>{
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseUrl + '/check_relation/'+col,'')
            .subscribe((response: any) => {
              this.TabChanged.next(response);
              resolve(response);
            }, reject);
        });
     }

     deleteRelationCol(data): Promise<any>{
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseUrl + '/delete_relation',data)
            .subscribe((response: any) => {
              this.TabChanged.next(response);
              resolve(response);
            }, reject);
        });
     }

     sendInvite(data): Promise<any>{
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseUrl + '/inviteMail',data)
            .subscribe((response: any) => {
              this.TabChanged.next(response);
              resolve(response);
            },reject);
        });
     }

    // for inserting activity log
    insertActivityLog(data): Promise<any>{
        return new Promise((resolve, reject) => {
          this._httpClient.post(this.baseUrl + '/activitylogstore',data)
              .subscribe((response: any) => {
                  resolve(response);
              }, reject);
         });
      }

    // for fetching activity log
    getActivityLog(data): Promise<any>{
        return new Promise((resolve, reject) => {
          this._httpClient.post(this.baseUrl + '/activitylogfetch',data)
              .subscribe((response: any) => {
                  let activityLogs = response.Result;
                  this.activityLogsChanged.next(activityLogs);
                  resolve(response);
              }, reject);
          });
        }

    /* Attachments Section by AS */

    /* Add Attachments in tabular */
    storeAttachments(data) {
       return this._httpClient.post(this.storeAttachmentsUrl,data);
    }

    /* Fetch Attachments in tabular */
    getAttachments(data){
     this._httpClient.post(this.getAttachmentsUrl,data).subscribe((response: any) => {
          let attachments = response.Result;
          this.attachmentALChanged.next(attachments);
      });
    }

    /* Download Attachments in tabular */
    downloadAttachment(data) {
        return this._httpClient.post(this.attachmentDownloadUrl,data);
    }

   /* Delete Attachment in tabular */
   deleteAttachments(id):Observable<any>{
     return this._httpClient.post(this.attachmentsDeleteUrl,id);
   }

   /* Store Notes in Tabular */
   storeNotes(data):Observable<any>{
     return this._httpClient.post(this.storeNotesUrl,data);
   }

   /* get Notes in Tabular */
   getNotes(data){
     this._httpClient.post(this.getNotesUrl,data).subscribe((response: any) => {
          let notes = response.Result;
          this.notesALChanged.next(notes);
      });
   }

   /* Delete Notes in Tabular */
   deleteNotes(id):Observable<any>{
     return this._httpClient.post(this.deleteNotesUrl,id);
   }

   /* Store Calendar Events in Tabular */
   calendarEvent(data):Observable<any>{
     return this._httpClient.post(this.storeCalendarUrl,data);
   }
}
