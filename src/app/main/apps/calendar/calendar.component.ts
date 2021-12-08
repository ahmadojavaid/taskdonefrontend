import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { startOfDay, isSameDay, isSameMonth, endOfDay, subDays, addDays, endOfMonth,addHours } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';

import Swal from 'sweetalert2';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { CalendarService } from 'app/main/apps/calendar/calendar.service';
import { CalendarEventModel } from 'app/main/apps/calendar/event.model';
import { CalendarEventFormDialogComponent } from 'app/main/apps/calendar/event-form/event-form.component';
const colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };

@Component({
    selector     : 'calendar',
    templateUrl  : './calendar.component.html',
    styleUrls    : ['./calendar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})


export class CalendarComponent implements OnInit
{
    actions: CalendarEventAction[];
    activeDayIsOpen: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    dialogRef: any;
    refresh: Subject<any> = new Subject();
    private userToken = localStorage.getItem('userToken');
    events: CalendarEvent[];
    selectedDay: any;
    view: string;
    viewDate: Date;

    constructor(
        private _matDialog: MatDialog,
        private _calendarService: CalendarService
    )
    {
        // Set the defaults
        this.view = 'month';
        this.viewDate = new Date();
        this.activeDayIsOpen = true;
        this.selectedDay = {date: startOfDay(new Date())};
        this.actions = [
            {
                label  : '<i class="material-icons s-16">edit</i>',
                onClick: ({event}: { event: CalendarEvent }): void => {
                    this.editEvent('edit', event);
                }
            },
            {
                label  : '<i class="material-icons s-16">delete</i>',
                onClick: ({event}: { event: CalendarEvent }): void => {
                    this.deleteEvent(event);
                }
            }
        ];
        this.getAllEvents();
    }

    ngOnInit(): void {
        this.refresh.subscribe(updateDB => {
            if ( updateDB )
            {
              //this.getAllEvents();
            }
        });

        this._calendarService.onEventsUpdated.subscribe(events => {
            this.getAllEvents();
            this.refresh.next();
        });
    }

    /* get all Calendar Events */
      getAllEvents(): void {
        this.events =  this._calendarService.events.map(item => {
            item.color = JSON.parse(item.color);
            item.actions = this.actions;
           return new CalendarEventModel(item);
        });
    }

    /**
     * Before View Renderer
     *
     * @param {any} header
     * @param {any} body
     */
    beforeMonthViewRender({header, body}): void {
        /* Get the selected day */
        const _selectedDay = body.find((_day) => {
            return _day.date.getTime() === this.selectedDay.date.getTime();
        });

        if ( _selectedDay )
        {
            /* Set selectedday style * @type {string} */
            _selectedDay.cssClass = 'mat-elevation-z3';
        }

    }

    /**
     * Day clicked
     *
     * @param {MonthViewDay} day
     */
    dayClicked(day: CalendarMonthViewDay): void {
        const date: Date = day.date;
        const events: CalendarEvent[] = day.events;

        if ( isSameMonth(date, this.viewDate) )
        {
            if ( (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0 )
            {
                this.activeDayIsOpen = false;
            }
            else
            {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
        this.selectedDay = day;
        this.refresh.next();
    }

    /**
     * Event times changed
     * Event dropped or resized
     *
     * @param {CalendarEvent} event
     * @param {Date} newStart
     * @param {Date} newEnd
     */
    eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void
    {
        event.start = newStart;
        event.end = newEnd;
        this.refresh.next(true);
    }

    /* Delete Calendar Events */
    deleteEvent(event): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent,{
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result){
               this._calendarService.deleteEvents(event.id).subscribe(
                 (resp)=>{
                   if(resp.statusCode == '200'){
                     Swal('Success...', resp.statusMessage, 'success');
                     const eventIndex = this.events.indexOf(event);
                     this.events.splice(eventIndex, 1);
                     this.refresh.next(true);
                   }else{
                     Swal('Oops...', resp.statusMessage,'error');
                   }
                 })
               }
            this.confirmDialogRef = null;
        });

    }

    /* Edit Events */
    editEvent(action: string, event: CalendarEvent): void{
        const eventIndex = this.events.indexOf(event);
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data      : {
                event : event,
                action: action
            }
        });

        this.dialogRef.afterClosed().subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':
                        const updateEvent = formData.getRawValue();
                        this.events[eventIndex] = Object.assign(this.events[eventIndex], formData.getRawValue());
                        let calendarId = this.events[eventIndex].id;
                        let updateEventData = {
                          'token':this.userToken,
                          'group_id':0,
                          'row_id':0,
                          'title':updateEvent.title,
                          'color':updateEvent.color,
                          'start':updateEvent.start._d ? updateEvent.start._d.toLocaleString() : updateEvent.start.toLocaleString(),
                          'end': updateEvent.end._d ? updateEvent.end._d.toLocaleString() : updateEvent.end.toLocaleString()
                        }
                        this._calendarService.updateEvents(calendarId,updateEventData)
                        this.refresh.next(true);
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        this.deleteEvent(event);
                        break;
                }
            });
    }

   /* Add Calendar Events */
    addEvent(): void{
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data      : {
                action: 'new',
                date  : this.selectedDay.date
            }
        });
        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if ( !response )
                {
                    return;
                }
                const newEvent = response.getRawValue();
                let eventData = {
                  'token':this.userToken,
                  'group_id':0,
                  'row_id':0,
                  'title':newEvent.title,
                  'color':newEvent.color,
                  'start':newEvent.start._d ? newEvent.start._d.toLocaleString() : newEvent.start.toLocaleString(),
                  'end': newEvent.end._d ? newEvent.end._d.toLocaleString() : newEvent.end.toLocaleString()
                }
                 this._calendarService.addEvents(eventData).subscribe(
                  (resp)=>{
                    if(resp.statusCode == 200){
                      newEvent.id = resp.id;
                      newEvent.actions = this.actions;
                      this.events.push(newEvent);
                      this.refresh.next(true);
                  }
                })
            });
          }
      }
