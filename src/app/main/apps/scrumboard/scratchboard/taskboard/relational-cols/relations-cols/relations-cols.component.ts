import { Component,Inject,Input,Output, EventEmitter } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {MatDialogRef} from '@angular/material';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {TaskboardClass} from '../../../class/taskboard-class';
import { TaskboardService } from '../../../services/taskboard.service';

@Component({
  selector: 'app-relations-cols',
  templateUrl: './relations-cols.component.html',
  styleUrls: ['./relations-cols.component.scss']
})
export class RelationsColsComponent {

  taskboardclass = new TaskboardClass();

  // Private
    private _unsubscribeAll: Subject<any>;

  constructor(
    private taskboardservice: TaskboardService,
    public dialogRef: MatDialogRef<RelationsColsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)

    {
      // Set the private defaults
       this._unsubscribeAll = new Subject();
       this._filter_boardHeading();
    }

    group  = this.data.group;
    allHeadings = this.data.boardheadings;
    boardHeadings:any[] = [];  //this.data.boardheadings;

    //filter boardHeadings
    loginId = this.data.loginId;
    type = this.data.type;

  /* Make Relation of Subtraction & Percentage Column with another Column */
  makeRelation(group,colPos,event) {
    let sendDat  = {
        'boardId':'1',
        'groupId' : group,
        'col_loc' : (colPos - 1),
        'relatedto_loc' : event.target.value ,
        'type' : this.type
    };
    let relationCol = this.taskboardservice.relationCol_submit(this.loginId,sendDat);
    this.dialogRef.close();
}

   /* Filter Board Heading to show data */
  _filter_boardHeading() {
    for(let bhead of this.data.boardheadings) {
      if(bhead.type !== "subtraction" && bhead.type !== "percentage") {
          this.boardHeadings.push(bhead);
      }
    }
  }

  /* Close Relational Col Dialog Box */
  onNoClick(){
    this.dialogRef.close();
  }
}
