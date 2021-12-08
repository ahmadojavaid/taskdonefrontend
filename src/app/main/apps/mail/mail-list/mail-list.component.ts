import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { Mail } from 'app/main/apps/mail/mail.model';
import { MailService } from 'app/main/apps/mail/mail.service';
import * as moment from 'moment';

@Component({
    selector     : 'mail-list',
    templateUrl  : './mail-list.component.html',
    styleUrls    : ['./mail-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class MailListComponent implements OnInit, OnDestroy
{
    mails: Mail[];
    currentMail: Mail;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _mailService: MailService,
        private _location: Location
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    /* On Init */
    ngOnInit(): void
    {
        this._mailService.onMailsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(mails => {
                this.mails = mails;
            });

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


}
