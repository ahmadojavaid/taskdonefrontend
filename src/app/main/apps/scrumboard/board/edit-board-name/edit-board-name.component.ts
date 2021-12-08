import { Taskboard } from './../../scratchboard/class/taskboard';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaskboardService } from '../../scratchboard/services/taskboard.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '../../../../../../../node_modules/@angular/router';

@Component({
    selector   : 'scrumboard-edit-board-name',
    templateUrl: './edit-board-name.component.html',
    styleUrls  : ['./edit-board-name.component.scss']
})
export class ScrumboardEditBoardNameComponent
{
    formActive: boolean;
    form: FormGroup;

    @Input()
    board;

    @Output()
    onNameChanged: EventEmitter<any>;

    @ViewChild('nameInput')
    nameInputField;

    constructor(
        private formBuilder: FormBuilder,
        private _httpClient: HttpClient,
        private router: Router,
        private _taskboardService :TaskboardService

    )
    {
        // Set the defaults
        this.formActive = false;
        this.onNameChanged = new EventEmitter();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open form
     */
    openForm(): void
    {
        this.form = this.formBuilder.group({
            name: [this.board.name]
        });
        this.formActive = true;
        this.focusNameField();
    }

    /**
     * Close form
     */
    closeForm(): void
    {
        this.formActive = false;
    }

    /**
     * Focus to the name field
     */
    focusNameField(): void
    {
        setTimeout(() => {
            this.nameInputField.nativeElement.focus();
        });
    }

    /**
     * On form submit
     */
    onFormSubmit(): void
    {
        if ( this.form.valid )
        {
            this.board.name = this.form.getRawValue().name;
            this.board.uri = encodeURIComponent(this.board.name).replace(/%20/g, '-').toLowerCase();

            this.onNameChanged.next(this.board.name);
            this.formActive = false;
        }
    }
}
