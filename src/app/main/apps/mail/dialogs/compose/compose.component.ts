import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { environment } from './../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
//import { MainSidebarService } from 'app/main/apps/mail/sidebars/main/main-sidebar.service';


@Component({
    selector     : 'mail-compose',
    templateUrl  : './compose.component.html',
    styleUrls    : ['./compose.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MailComposeDialogComponent
{
    showExtraToFields: boolean;
    composeForm: FormGroup;
    selemail: any;
    composeAttachmentFiles: any = [];

    
    /**
     * Constructor
     *
     * @param {MatDialogRef<MailComposeDialogComponent>} matDialogRef
     * @param _data
     */
    constructor(
        public matDialogRef: MatDialogRef<MailComposeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any
    )
    {
        // Set the defaults
        this.composeForm = this.createComposeForm();
        this.showExtraToFields = false;
    }


    /**
     * Create compose form
     *
     * @returns {FormGroup}
     */
    createComposeForm(): FormGroup
    {
      let exp = '(([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)(\\s*;\\s*|\\s*$))*';
        return new FormGroup({
            from   : new FormControl({
                value   : "",
                disabled: true
            }),
            to     : new FormControl('', [Validators.required, Validators.pattern(exp)]),
            cc     : new FormControl('', [Validators.pattern(exp)]),
            bcc    : new FormControl('', [Validators.pattern(exp)]),
            subject: new FormControl('', [Validators.required]),
            message: new FormControl('', [Validators.required]),
            attachments: new FormControl('')
        });
    }

    /**
     * Toggle extra to fields
     */
    toggleExtraToFields(): void
    {
        this.showExtraToFields = !this.showExtraToFields;
    }

    // on adding attachments to compose section
    uploadComposeAttachments(event) {
        let files = event.target.files;
        for (var i = 0; i < files.length; i++) {
            this.composeAttachmentFiles.push(files[i]);
        }
        this.composeForm.controls.attachments.patchValue(this.composeAttachmentFiles);
    }

    // on deleting attachments from mail compose section
    removeComposeAttachments(index) {
        this.composeAttachmentFiles.splice(index,1);
        this.composeForm.controls.attachments.patchValue(this.composeAttachmentFiles);
    }
}
