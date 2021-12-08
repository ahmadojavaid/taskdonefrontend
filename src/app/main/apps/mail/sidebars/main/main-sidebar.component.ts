import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {MatDialog, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
//import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { MailService } from 'app/main/apps/mail/mail.service';
import { MailComposeDialogComponent } from 'app/main/apps/mail/dialogs/compose/compose.component';

@Component({
    selector     : 'mail-main-sidebar',
    templateUrl  : './main-sidebar.component.html',
    styleUrls    : ['./main-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class MailMainSidebarComponent implements OnInit, OnDestroy
{
    folders: any[];
    filters: any[];
    labels: any[];
    accounts: object;
    selectedAccount: string;
    dialogRef: any;
    horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MailService} _mailService
     * @param {MatDialog} _matDialog
     */

    constructor(
        private _mailService: MailService,
        private snackBar: MatSnackBar,
        public _matDialog: MatDialog,
        private router: Router
    )
    {
        this.getMailAccount();
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        //this.getMailAccountFolders();
    }


    ngOnInit(): void
    {
        this._mailService.onFoldersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(folders => {
                this.folders = folders;
            });
    }


    /* Get Mail Configure Account Url */
    getMailAccount(){
      this._mailService.getMailAccount().subscribe(
        (resp)=>{
          if(resp.statusCode == "200"){
            this.accounts = resp.result.reverse();
            this.selectedAccount = this.accounts[0].mailRef;
            localStorage.setItem("selectedAccount",this.selectedAccount);
            this.getMailAccountFolders(this.selectedAccount);
          }else if(resp.statusCode == "400"){
            this.snackBar.open(resp.statusMessage, 'X', {
                duration: 5000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: "top",
            });
          }else if(resp.statusCode == "1000"){
            this.snackBar.open(resp.statusMessage, 'X', {
                duration: 5000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: "top",
            });
            setInterval(() => {
              localStorage.removeItem('userToken');
              this.router.navigate(['/pages/auth/login-2']);
           },3000);
          }
        }
      )
    }


    /* Get Mail Account Folder */
    getMailAccountFolders(mailRefValue){
      let data = {
        accountRef : mailRefValue
      }
      this._mailService.getFolders(data);
    }

    /* Change Mail Account */
    changeClient(event){
      localStorage.setItem("selectedAccount",event);
      this.getMailAccountFolders(event);
    }

    /* Get Folder Name */
    getMailsByFolder(folder){
      const data = {
        "start":0,
        "limit":14,
        "accountRef" : this.selectedAccount,
        "path" : folder.path,
        "fullName" : folder.fullName
      }
      this._mailService.getMailsListByFolder(data);
    }


    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    /**
     * Compose dialog
     */
    composeDialog(): void
    {
      this.dialogRef = this._matDialog.open(MailComposeDialogComponent, {
            panelClass: 'mail-compose-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];

                switch ( actionType )
                {
                    /**
                     * Send
                     */
                    case 'send':
							   if (localStorage.getItem("selectedAccount").length > 0)
							  {
                  let selAcc = localStorage.getItem("selectedAccount");
                  let formValue = new FormData();
                  formValue.append('bcc', formData.value.bcc);
                  formValue.append('cc', formData.value.cc);
                  formValue.append('from', selAcc);
                  formValue.append('to', formData.value.to);
                  formValue.append('message', formData.value.message);
                  formValue.append('subject', formData.value.subject);
                  formValue.append('selEmail', selAcc);

                  for (let file of formData.value.attachments) {
                      formValue.append('attachments[]',file);
                  }

                  this._mailService.addComposeMails(formValue).subscribe(
                    (response) => {
                      console.log(response,"response");
                    }
                  )}

                break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        console.log('delete Mail');
                    break;

                    /**
                     * Delete
                     */
                    case 'draft':
                        if (localStorage.getItem("selectedAccount").length > 0)
                        {
                            let formValue = new FormData();
                            let selAcc = localStorage.getItem("selectedAccount");
                            formValue.append('from', selAcc);
                            formValue.append('selEmail', selAcc);

                            if(formData.controls.bcc.valid) {
                                formValue.append('bcc', formData.value.bcc);
                            }

                            if(formData.controls.cc.valid) {
                                formValue.append('cc', formData.value.cc);
                            }

                            if(formData.controls.from.valid) {
                                formValue.append('from', selAcc);
                            }

                            if(formData.controls.to.valid) {
                                formValue.append('to', formData.value.to);
                            }

                            if(formData.controls.message.valid) {
                                formValue.append('message', formData.value.message);
                            }

                            if(formData.controls.subject.valid) {
                                formValue.append('subject', formData.value.subject);
                            }

                            if(formData.controls.attachments.valid) {
                                for (let file of formData.value.attachments) {
                                    formValue.append('attachments[]',file);
                                }
                            }

                            console.log(formData.value,"formValue")

                            this._mailService.addDraftMails(formValue).subscribe(
                              (resp) => {
                                console.log(resp,"resp");
                              }
                            )

                            // return new Promise((resolve, reject) => {
                            //     this._httpClient.post(this.baseUrl+'/draft-mail',formValue)
                            //         .subscribe((response: any) => {
                            //             // console.log(response);
                            //             if(response.statusCode == 1) {
                            //                 this.snackBar.open('Mail saved as draft.', 'X', {
                            //                     duration: 5000,
                            //                     horizontalPosition: this.horizontalPosition,
                            //                     verticalPosition: this.verticalPosition,
                            //                   });
                            //             }
                            //         }, reject);
                            //         resolve(response);
                            // });
                        }
                    break;
                }
            });
    }
    }
