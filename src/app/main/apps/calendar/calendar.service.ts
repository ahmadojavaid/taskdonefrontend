import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { environment } from 'environments/environment';

@Injectable()
export class CalendarService implements Resolve<any>
{
    events: any;
    onEventsUpdated: Subject<any>;
    baseUrl = environment.baseUrl;
    private userToken = localStorage.getItem('userToken');
    private addEventsUrl = this.baseUrl + '/addCalendarEvent';
    private getEventsUrl = this.baseUrl + '/getallEvents';
    private updateCalendarEventsUrl = this.baseUrl + '/updateCalendarEvent/';
    private deleteEventUrl = this.baseUrl + '/deleteCalendarEvent/';

    constructor(
        private _httpClient: HttpClient
    )
    {
      this.onEventsUpdated = new Subject();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getEvents()
            ]).then(
                ([events]: [any]) => {
                    resolve();
                },
                reject
            );
        });
    }

    /* Add Calendar Events */

    addEvents(data):Observable<any>{
        return this._httpClient.post(this.addEventsUrl,data);
    }

  /* Get all Calendar Events */
   getEvents(): Promise<any>{
          return new Promise((resolve, reject) => {
            let token = {'token':this.userToken}
            this._httpClient.post(this.getEventsUrl,token)
               .subscribe((response: any) => {
                    this.events = response.Result;
                    this.onEventsUpdated.next(this.events);
                    resolve(this.events);
                }, reject);
          });
        }


     /* Delete Calendar Events */
     deleteEvents(calendarId):Observable<any>{
       let token = {'token':this.userToken}
       return this._httpClient.post(this.deleteEventUrl + calendarId,token);
     }

    updateEvents(calendarId,updateEventData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.updateCalendarEventsUrl + calendarId,updateEventData)
                .subscribe((response: any) => {
                    this.getEvents();
                }, reject);
         });
     }
   }
