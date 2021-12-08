import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators  } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { MatColors } from '@fuse/mat-colors';
import { CalendarEventModel } from 'app/main/apps/calendar/event.model';
import * as moment from 'moment';

@Component({
    selector     : 'calendar-event-form-dialog',
    templateUrl  : './event-form.component.html',
    styleUrls    : ['./event-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CalendarEventFormDialogComponent
{
    action: string;
    event: CalendarEvent;
    eventForm: FormGroup;
    dialogTitle: string;
    presetColors = MatColors.presets;
    minDate = new Date();
    minEndDate = new Date();
    //titleFormat = '[a-zA-Z0-9_]*';
    titleFormat = '^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$'
    hexColorFormat = "^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$";

    constructor(
        public matDialogRef: MatDialogRef<CalendarEventFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    )
    {
        this.event = _data.event;
        this.action = _data.action;
        if ( this.action === 'edit' )
        {
            this.dialogTitle = this.event.title;
        }
        else
        {
            this.dialogTitle = 'New Event';
            this.event = new CalendarEventModel({
                start: new Date(),
                end  : new Date()
            });
        }

        this.eventForm = this.createEventForm();
    }

    /* Date Custom validation */
    dateChanged(value) {
      this.minEndDate = moment(value).toDate();
      this.eventForm.patchValue({
        "end": ''
     });
    }

    /* Create the event form */
    createEventForm(): FormGroup
    {
        return new FormGroup({
            title : new FormControl(this.event.title,
                    [Validators.required,Validators.maxLength(50),
                    Validators.pattern(this.titleFormat)]),
            start : new FormControl(this.event.start,Validators.required),
            end   : new FormControl(this.event.end,Validators.required),
            color : this._formBuilder.group({
                primary  : new FormControl(this.event.color.primary,
                          [Validators.required,Validators.pattern(this.hexColorFormat)]),
                secondary: new FormControl(this.event.color.secondary,
                          [Validators.required,Validators.pattern(this.hexColorFormat)])
            })
        });
    }
}
