import { MaterialModule } from './../../../../angular-material-elements/material.module';
import { style } from '@angular/animations';
import { Mail } from 'app/main/apps/mail/mail.model';
import { List } from './../../list.model';
import { Component,
         OnInit,
         Input,
         Output,
         EventEmitter,
         Pipe,
         PipeTransform,
         TemplateRef, ViewChild, ViewEncapsulation
         } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,Validators,NgModel } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MatDatepicker,MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogRef, MatDrawer, MatSidenav,MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Observable} from 'rxjs/Rx';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import 'setimmediate';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Router,ActivatedRoute } from '../../../../../../../node_modules/@angular/router';

import { TaskboardService } from '../services/taskboard.service';
import {TaskboardClass} from '../class/taskboard-class';
import {TaskboardPersonClass} from '../class/person-class';
import { TaskboardStatusClass } from '../class/status-option-class';
import { CountryClass } from '../class/country-class';
import { TabularService } from 'app/main/apps/scrumboard/tablular-list/services/tabular.service';

import { ChoosePersonComponent } from 'app/main/apps/scrumboard/scratchboard/taskboard/choose-person/choose-person.component';
import {RelationsColsComponent} from 'app/main/apps/scrumboard/scratchboard/taskboard/relational-cols/relations-cols/relations-cols.component';

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as moment from 'moment';

@Component({
  selector: 'app-taskboard',
  templateUrl: './taskboard.component.html',
  styleUrls: ['./taskboard.component.scss'],
  providers: [DatePipe,TaskboardService]
})

@Pipe({
  name: 'dateFormatPipe',
})

export class TaskboardComponent implements OnInit,PipeTransform  {
  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;
  confirmDialogRef: MatDialogRef<ChoosePersonComponent>;
  dialogRef: any;

//transform();
transform(value: any, datefrm): any {
  return datefrm;
}
taskboardclass = new TaskboardClass();
boardheads:any = this.taskboardclass.defaultBoards;
boardUndoData:any ;
//boardheads:any;
personclass = new TaskboardPersonClass();
personDetails:any = [];

statusoptions=new TaskboardStatusClass();

/* countries list */
countries = new CountryClass();
Countryitems:any= this.countries.countries;
configCountry: any = {'placeholder': 'Enter Country Name', 'sourceField': ['name']};
selecteCountry: any = '';
CountryChanged: any = '';
loading = false;
showOpts = [];
headRowPos;
headColPos;
edittag:any;
attachmentFile : any;
tblWidth :number = 1000;
rowName : string;
minDate = new Date();
minEndDate = new Date();
minDatePickerDate = new Date();
//editRow :boolean = false;

//Define variable for edit Row

editRow_grp;
editRow_row;
editRow_col;
Result;
address:any;
form: FormGroup;
numberForm: FormGroup;
phoneForm:FormGroup;
rowForm:FormGroup;
textForm:FormGroup;
customFieldForm:FormGroup;
dbResult:any;
loggedId:any;
DummyDate = new FormControl(new Date());
date;
fetchedData:any;

//FOR STATUS CHANGE
show:boolean = false;
options:any = this.statusoptions.StatusList[0].status;//[{ 'name':'Done','color':'green'},{'name':'stuck','color':'red'},{'name':'working on it','color':'yellow'}];
statusForm: FormGroup;

//For timeline hover
timelineIndex:any = null;
dayDiff:any;

//For Activity Logs
activityLog = [];
beforeValue = null;

//For Invite users
inviteIndex = null;

//For Attachment by AS
attachmentsAL = [];
notesAL = [];
attachmentsALColumns: string[] = ['filename', 'notes', 'user_id', 'updated_at','actions'];
attachmentToggle = false;
notesToggle = false;
rowAl: number;
grpAl: number;

@ViewChild('drawer') sidenav;

/**
* relationalChange_boolean params
**/

_rgrp:number;
_rrow:number;
_rcol:number;
start_date:Date;
end_date:Date;
relationalCols:any;
//timelineColor:boolean;
boardId:any;
errorTabularMessage:string;

horizontalPosition: MatSnackBarHorizontalPosition = 'end';
verticalPosition: MatSnackBarVerticalPosition = 'bottom';

public editorContent: string;


@Output()
  onNameChanged: EventEmitter<any>;

@Output() boardDataEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private _taskboardservice: TaskboardService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    public _matDialog: MatDialog,
    private _httpClient: HttpClient,
    private router: Router,
    private route:ActivatedRoute,
    private snackBar: MatSnackBar,
    private _tabularService:TabularService
  ) {
      this.start_date = new Date();
      this.end_date = new Date();
      this.onNameChanged = new EventEmitter();
      this._taskboardservice.activityLogsChanged.subscribe((activities) => {
        this.activityLog = activities.reverse();
      });
      this.statusForm = new FormGroup({ title : new FormControl()});
      this.route.queryParams.subscribe( queryParams => { this.boardId = queryParams.id});
  }

  ngOnInit() {
    this.numberForm = this._formBuilder.group({
      numberField: [null, Validators.compose([Validators.required])],
    });

    this.phoneForm = this._formBuilder.group({
      phone: [null, Validators.compose([Validators.required, CustomValidators.phone('IN'),Validators.minLength(5), Validators.maxLength(10)])]
    });

    this.rowForm = this._formBuilder.group({
      rowField: [null, Validators.compose([Validators.required])]
    })

    this.textForm = this._formBuilder.group({
       textField: [null,Validators.compose([Validators.required])]
    })

    this.customFieldForm = this._formBuilder.group({
      customField: [null,Validators.compose([Validators.required])]
    })

    this.loggedId = localStorage.getItem('userToken');
    this.checkDB();
    this.statusList('get',this.loggedId,'');
    this.getPersonDetailList();
    this.getRelationdata();
    this.getAttachmentsData();
    this.getNotesData();
 }

 /* To get Initial Board Data API */
  checkDB(){
    if(this.boardId){
      let data = {
        "boardId":this.boardId
      }
      this._tabularService.getGroupDataTabular(data).subscribe(
        (response) => {
           if(response.statusCode == '200'){
             if(response.Result.length !== 0){
              this.dbResult = response.Result;
              this.boardheads = this.dbResult;
              this.boardDataEvent.emit(this.boardheads);
           }else{
             this.boardheads = this.taskboardclass.defaultBoards;
           }
        }
      })
   }
}

/* Get Person List of the Person Col in the group */
  getPersonDetailList(){
   this._taskboardservice.getPersonlist().then(
     data => {
         //this.initData(data);
          this.Result = data;
           if(this.Result.statusCode == '1'){
               this.personDetails = this.Result.Result;
             }else{
               this.personDetails = this.personclass.PersonList.detail;
             }
         });
      }

  getRelationdata(){
    this._taskboardservice.getRelationalCols(1).then(data => {
      let res = data;
      this.relationalCols = res;
      setImmediate(()=>{
        this.relationalCols.Result;
      })
    });
  }

  /* Get Attachments in tabular Group */
  getAttachmentsData(){
    this._taskboardservice.attachmentALChanged.subscribe((attachments) => {
      this.attachmentsAL = attachments.reverse();
    });
 }

 /* Get Attachments in tabular Group */
 getNotesData(){
   this._taskboardservice.notesALChanged.subscribe((notes) => {
     this.notesAL = notes.reverse();
   });
}

  /* Add Group Heading Form */
  onFormHeadingSubmit(rowPos, colPos): void {
      if (this.form.valid){
         var headName = this.form.getRawValue().head_name;
         if(headName.length > 0) {
           this.boardheads[rowPos].heading[colPos].tab = headName.toUpperCase();;
           if(this.dbResult != '' && typeof this.dbResult != 'undefined'){
             this.updateBoard('header',rowPos,colPos,this.boardheads[rowPos].groupid,this.boardheads[rowPos]);
           }else{
             this.insertBoard(this.loggedId, this.boardheads);
           }
         }
      }
       this.closeForm(rowPos,colPos);
   }

  /* Edit Group Heading Form */
  editHeading(rowPos,colPos,headingName) : void {
      this.headRowPos = rowPos;
      this.headColPos = colPos;
      this.form = this._formBuilder.group({
        head_name: [headingName.toUpperCase()]
      });
    }

  /* Show-hide return function of Group Heading Form */
  changehead(rowPos, colPos) {
       if(rowPos == this.headRowPos && colPos == this.headColPos) {
          return true;
        } else {
          return false;
        }
    }

  /* Close Change Group Heading Form */
  closeForm(rowPos, colPos) {
      this.headRowPos = null;
      this.headColPos = null;
      this.changehead(rowPos,colPos);
    }

  /* show & hide row,col icon */
  popupOpts_show(i):boolean{
      if(this.showOpts[i] !== true){
        return this.showOpts[i] = true;
      }else{
        return this.showOpts[i] = false;
      }
  }

  /* Add new row in the group */
  addRow(groupIndex):void {
     var row =  {
      "tab" : [
             "Dummy Row",
             "1",
             "30-08-18",
             "Dummy text here"
             ]};

      /* api for add row */
      if(this.dbResult != '' && typeof this.dbResult != 'undefined'){
          const data = {
            arrpos:groupIndex,// index of the group where row has to be inserted
            gid : this.boardheads[groupIndex].groupid, // group id of the group where row has to be inserted
            header: this.boardheads[groupIndex].heading, // Headers of the group where row has to be inserted
            rowno:this.boardheads[groupIndex].boards.length // Length of the board
          }
          this.showOpts[groupIndex] = false;
          this.addnewRowCol('row',data);
      }else{
          this.insertBoard(this.loggedId, this.boardheads);
          this.boardheads[groupIndex].boards.push(row);
      }
   }

 /* Add new Columns in the group */
  addCols(i,tab,type){
      let timelineExists;
      if(type == "timeline") {
        for(let headingType of this.boardheads[i].heading) {
          if(headingType.type == "timeline") {
            timelineExists = 1;
            Swal('Oops...', 'Timeline already exists', 'error');
          }
       }
       if(timelineExists != 1) {
          var newHeading  = {
            "tab" : tab,
            "type" : type
          };
          this.boardheads[i].heading.push(newHeading);
          for(let a = 0; a < this.boardheads[i].boards.length; a++ ) {
              var ChangedDate = this.datePipe.transform(this.start_date, 'yyyy,M,dd');
              ChangedDate = new FormControl(new Date(ChangedDate)).value;
              let timeline:any = { "start" : ChangedDate, "end":ChangedDate}
              this.boardheads[i].boards[a].tab.push(timeline);
          }
           this.showOpts[i] = false;
         }
      }else {
         if(type == 'substraction' || type == 'percentage') {
           this._relationalCols(type,i);
         }
         var newHeading = {"tab" : tab,"type" : type };
         this.boardheads[i].heading.push(newHeading);
         for(let a = 0; a < this.boardheads[i].boards.length; a++ ) {
             if(type == 'link'){
                this.showOpts[i] = false;
                let link:any = { "url" : "", "name":type}
                this.boardheads[i].boards[a].tab.push(link);
             }else if(type == "auto-number"){
                this.showOpts[i] = false;
                let ai:any = a+1;
                this.boardheads[i].boards[a].tab.push(ai);
             }else{
               this.showOpts[i] = false;
               this.boardheads[i].boards[a].tab.push(type);
              }
          }
      }
      if(this.dbResult != '' && typeof this.dbResult != 'undefined'){
         this.addnewRowCol('col',this.boardheads[i]);
         this.getRelationdata();
      }else{
        this.insertBoard(this.loggedId, this.boardheads);
     }
  }

 /* API call for adding New Row & Column in the Group */
  addnewRowCol(tag,board){
    const data={
      tag: tag, // To add new Row in the group
      data:board // To insert board data in the group
    }
   this._taskboardservice.newRowColm(data).then(
      data => {
          if(tag == 'row'){
             let res:any = data;
             this.boardheads[res.Result.i].boards.push(res.Result.row);
          }
      });
  }

  /* Delete Row from group API */
  row_delete(grp,row){
    Swal({
        title: 'Are you sure?',
        text: "You want to delete this Row",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm'
    }).then((result) => {
        if (result.value) {
            this.boardheads[grp].boards.splice(row,1);
            if(this.boardheads[grp].groupid !== ''){
             //JSON.stringify(this.boardheads[grp]);
             this.updateBoard('deleteRow',grp,row,this.boardheads[grp].groupid,this.boardheads[grp].boards[row]); // to update rows
           }
         }
      });
  }


  /* Delete Column in Tabular */
  Col_delete(row,col){
    this._taskboardservice.checkRelation(col).then(data=>{
        this.boardUndoData = "";
        if(data.statusCode == '1'){
              Swal({
                title: 'Are you sure?',
                text: "This column is related to other Column!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirm'
              }).then((result) => {
                if (result.value) {
                   if(data.Result.length == '1' && data.Result[0].relatedto_location != col){
                      Swal(
                        'Deleted!',
                        'Your related column deleted.',
                        'success'
                      )
                      this.boardheads[row].heading.splice(col,1);
                      for(let a = 0; a < this.boardheads[row].boards.length; a++ ) {
                          this.boardheads[row].boards[a].tab.splice(col,1);
                      }
                      this.updateBoard('deleteheader',row,col,this.boardheads[row].groupid,this.boardheads[row]); // to update headers
                      this.updateBoard('deleterowCol',row,col,this.boardheads[row].groupid,this.boardheads[row].boards);
                      this.deleteRel('norel',col);
                   }else{
                          Swal(
                            'Deleted!',
                            'Your All related column deleted.',
                            'success'
                          );
                          this.boardheads[row].heading.splice(col,1);
                          for(let a = 0; a < this.boardheads[row].boards.length; a++ ) {
                              this.boardheads[row].boards[a].tab.splice(col,1);
                          }
                          this.updateBoard('deleteheader',row,col,this.boardheads[row].groupid,this.boardheads[row]); // to update headers
                          this.updateBoard('deleterowCol',row,col,this.boardheads[row].groupid,this.boardheads[row].boards);
                          this.deleteRel('rel',col);
                      }

                }
              })
        }else{
          Swal({
            title: 'Are you sure?',
            text: "You want to delete this Column",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm'
          }).then((result) => {
              if(result.value){
                  this.boardUndoData = JSON.parse(JSON.stringify(this.boardheads[row]));
                  this.boardheads[row].heading.splice(col,1);
                  for(let a = 0; a < this.boardheads[row].boards.length; a++ ) {
                      this.boardheads[row].boards[a].tab.splice(col,1);
                  }
                  this.updateBoard('deleteheader',row,col,this.boardheads[row].groupid,this.boardheads[row]); // to update headers
                  this.updateBoard('deleterowCol',row,col,this.boardheads[row].groupid,this.boardheads[row].boards); // to update rows
                  Swal({
                    title: 'Deleted',
                    text: "Click Undo if want to revert",
                    type: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Okay',
                    cancelButtonText:'Undo'
                  }).then((result) => {
                      if(!result.value){
                        this.addnewRowCol('col',this.boardUndoData);
                        Swal('Success!','Action Done','success');
                        this.boardheads[row] = this.boardUndoData;
                        this.boardheads[row].heading.splice(col,0);
                        for(let b = 0; b < this.boardheads[row].boards.length; b++ ) {
                          this.boardheads[row].boards[b].tab.splice(col,0);
                        }
                      }
                  });
               }
           });
         }
     });
   }


  /* On Number Form Submit */
  onNumberSubmit(formValue,groupPos,rowPos,colPos){
    if(this.numberForm.valid){
      let numberFieldValue = formValue.value.numberField;
      this.onKeyForm(numberFieldValue,groupPos,rowPos,colPos);
    }
  }

  /* On Number Form Submit */
  onPhoneNumberSubmit(formValue,groupPos,rowPos,colPos){
    if(this.phoneForm.valid){
      let phoneFieldValue = formValue.value.phone;
      this.onKeyForm(phoneFieldValue,groupPos,rowPos,colPos);
    }
  }

  /*on Row Form Submit */
  onRowFormSubmit(formValue,groupPos,rowPos,colPos){
    if(this.rowForm.valid){
      let rowFieldValue = formValue.value.rowField;
      this.onKeyForm(rowFieldValue,groupPos,rowPos,colPos);
    }
  }

  /*on Text Form Submit */
  ontextFormSubmit(formValue,groupPos,rowPos,colPos){
    if(this.textForm.valid){
      let textFieldValue = formValue.value.textField;
      this.onKeyForm(textFieldValue,groupPos,rowPos,colPos);
    }
  }

  /* On Custom Field Form Submit */
  onCustomFormSubmit(formValue,groupPos,rowPos,colPos){
    if(this.customFieldForm.valid){
      let customFieldValue = formValue.value.customField;
      this.onKeyForm(customFieldValue,groupPos,rowPos,colPos);
    }
  }

  /* Google autocomplete Address */
  autoCompleteCallback1(selectedData:any,groupPos,rowPos,colPos) {
    this.address = selectedData.data.formatted_address;
    this.onKeyForm(this.address,groupPos,rowPos,colPos);
  }

  /* On Key Form Submit */
  onKeyForm(value,groupPos,rowPos,colPos) {
    this.rowName = value;
    this.boardheads[groupPos].boards[rowPos].tab[colPos] = this.rowName;
      this.editRow_grp = null;
      this.editRow_row = null;
      this.editRow_col = null;
      this.editRow(groupPos,rowPos,colPos);
      if(this.dbResult != '' && typeof this.dbResult != 'undefined'){
        this.updateBoard('row',rowPos,colPos,this.boardheads[groupPos].groupid,this.boardheads[groupPos].boards);
      }else{
        this.insertBoard(this.loggedId,this.boardheads);
      }
  }

  onKey(event,groupPos,rowPos,colPos) {
    this.rowName = event.target.value;
    this.boardheads[groupPos].boards[rowPos].tab[colPos] = this.rowName;
      this.editRow_grp = null;
      this.editRow_row = null;
      this.editRow_col = null;
      this.editRow(groupPos,rowPos,colPos);
      if(this.dbResult != '' && typeof this.dbResult != 'undefined'){
        this.updateBoard('row',rowPos,colPos,this.boardheads[groupPos].groupid,this.boardheads[groupPos].boards);
      }else{
        this.insertBoard(this.loggedId,this.boardheads);
      }
  }

  //Edit Row
  editRow(group,Row,Col) {
    if(this.editRow_grp == group && this.editRow_row == Row && this.editRow_col == Col) {
      return true;
    } else {
      return false;
    }
  }

  Clk_editRow (group,Row,Col) : void {
      this.beforeValue =  this.boardheads[group].boards[Row].tab[Col];
      this.editRow_grp = group;
      this.editRow_row = Row;
      this.editRow_col = Col;
      this.editRow(group,Row,Col);
  }

  onClose(i,r,a){
    this.editRow_grp = null;
    this.editRow_row = null;
    this.editRow_col = null;
    this.editRow(i,r,a);
  }

    //Change Date on calander change
    //event: MatDatepickerInputEvent<Date>
   changeRow_date(event,group,Row,Col) : void {
        this.boardheads[group].boards[Row].tab[Col] = event.target.value._d;
        var ChangedDate = this.datePipe.transform(event.target.value._d, 'y,M,dd');
        ChangedDate = new FormControl(new Date(ChangedDate)).value;
        this.editRow_grp = null;
        this.editRow_row = null;
        this.editRow_col = null;
        this.editRow(group,Row,Col);

        this.boardheads[group].boards[Row].tab[Col] = ChangedDate;
        if(this.dbResult != '' && typeof this.dbResult != 'undefined'){
          this.updateBoard('row',Row,Col,this.boardheads[group].groupid,this.boardheads[group].boards);
        }else{
          this.insertBoard(this.loggedId,this.boardheads);
        }
  }

  //select person
  selectPerson(event,group,row,col){
    this.beforeValue =  this.boardheads[group].boards[row].tab[col]; // for activity log
    let id= 'uname'+group+'_'+row+'_'+col;
    let unameVal:any='';
    this.dialogRef = this._matDialog.open(ChoosePersonComponent, {
      panelClass: 'person-form-dialog',
      data      : {
          uname:event.target.innerText
    }
  });
  this.dialogRef.afterClosed()
  .subscribe(response => {
      if ( !response )
      {
          return;
      }
      unameVal = response;
      JSON.stringify(this.personDetails.find(x => x.id === unameVal.id));
      this.personDetails.firstChar = unameVal.fullName.charAt(0);
      let personNew = this.personDetails.find(x => x.id === unameVal.id);
      this.boardheads[group].boards[row].tab[col] = personNew.id;
      if(this.dbResult != '' && typeof this.dbResult != 'undefined'){
        this.updateBoard('row',row,col,this.boardheads[group].groupid,this.boardheads[group].boards);
      }else{
        this.insertBoard(this.loggedId,this.boardheads);
      }
      // console.log('name after change :'+ this.boardheads[group].boards[row]);
    });
  }


   //insert new board
  insertBoard(uid,boards){
    const data={
      token : uid,
      board_id:this.boardId,
      data : boards
    }
    this._tabularService.createGroupDataTabular(data).subscribe(
      (response) => {
         if(response.statusCode == '200'){
          this.checkDB();
        }else if(response.statusMessage == 'Id cannot be Empty'){
          Swal('Oops...', "Please Save first", 'warning');
          //this.boardheads = this.taskboardclass.defaultBoards;
       }
     })
   }

  /* Update Template & Projects in Tabular */
  fieldType:any;

  updateBoard(tag,row,col,gpid,boarddata){
    if(tag == "row") {
      let gindex = 0;
       // for group index according to group id
      for (var head of this.boardheads) {
        if(head.groupid == gpid) {
          break;
        }
        gindex++;
      }
      const data={
        tag: tag,
        groupid : gpid,
        groupPos : row,
        groupColPos : col,
        data: boarddata
      }
     let tabInfo = this.boardheads[gindex].boards[row].tab;  // changing row values
     this.fieldType = this.boardheads[gindex].heading[col].type;

      let activity = {
        "boardid": this.boardheads[0].board_id,
        "groupid": gpid,
        "rowindex": row,
        "changeValue": {
          "before": this.beforeValue,
          "after": boarddata[row].tab[col]
        },
        "changeField": this.boardheads[gindex].heading[col].tab,
        "changeFieldType": this.boardheads[gindex].heading[col].type,
        "userToken": localStorage.getItem('userToken')
      };

       if(this.fieldType == "timeline"){
          let calendarEventData = {
             "group_id": gpid,
             "row_id": row,
             "title": boarddata[row].tab[0],
  					 "start": boarddata[row].tab[col].start.toLocaleString(),
  					 "end": boarddata[row].tab[col].end.toLocaleString(),
             "color":{
               "primary": '#1e90ff',
               "secondary": '#D1E8FF'
             },
             "changeFieldType": this.boardheads[gindex].heading[col].type,
             "userToken": localStorage.getItem('userToken')
          }
          this._taskboardservice.calendarEvent(calendarEventData).subscribe(
            (resp)=>{
              console.log(resp,"resp")
            }
          )
       }

      if(activity.changeValue.before != activity.changeValue.after) {
          this._taskboardservice.insertActivityLog(activity);
      }

      /* Comment on line 618-621*/
      this._taskboardservice.updateGroup(data).then(
        response => {
            //console.log(response);
      });
    }else {
      const data={
        tag: tag,
        groupid : gpid,
        groupPos : row,
        groupColPos : col,
        data:boarddata
      }
       /* Comment on line 632-636  */
      this._taskboardservice.updateGroup(data).then(
        response => {
          //console.log(response);
      });
    }
  }

   /* Status Field change & update in Tabular */
   statusUpdate(event,group,row,col){
      this.beforeValue =  this.boardheads[group].boards[row].tab[col];
      (<HTMLInputElement>document.getElementById('statusChange'+group+row+col)).style.display="block";
    }

    /* To Close Status Box in Tabular */
    closeStatusUpdate(group,row,col) {
      (<HTMLInputElement>document.getElementById('statusChange'+group+row+col)).style.display="none";
    }


    chooseOption(option,group,row,col){
      //alert(this.options[option].name);
      this.boardheads[group].boards[row].tab[col]=option;//this.options[option].name;
          if(this.dbResult != '' && typeof this.dbResult != 'undefined'){
            this.updateBoard('row',row,col,this.boardheads[group].groupid,this.boardheads[group].boards);
          }else{
            this.insertBoard(this.loggedId,this.boardheads);
          }
      (<HTMLInputElement>document.getElementById('statusChange'+group+row+col)).style.display="none";
      //this.matDialogRef.close(this.options[option].name);
    }

    onKeyup(event,i){
      this.options[i].name=event.target.value;
    }

    openFrm(flag,frm){
      if(flag == 't'){
        this.show=true;
      }else{
        this.show=false;
        this.statusList('update',this.loggedId,this.options);
      }
    }


    statusList(tag,id,options) {
      //statusOptions
      const data = {
        token : id,
        tag:tag,
        list:options
      }
      //if(options !== ''){
        this._taskboardservice.statusOptions(data).then(data => {
        if(data.statusCode == '1'){
          this.options = data.Result;
        }
      })
    //};
    }

    //check for number
    isNumber(event,i,r,a) {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
        if (event.which == 64 || event.which == 16) {
            // to allow numbers
            return false;
        } else if (event.which >= 48 && event.which <= 57) {
            // to allow numbers
            return true;
        } else if (event.which >= 96 && event.which <= 105) {
            // to allow numpad number
            return true;
        } else if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
            // to allow backspace, enter, escape, arrows
            return true;
        } else {
            event.preventDefault();
            // to stop others
            return false;
        }

  }

  checkNumber(event,i,r,a){
      let numbers = /^[0-9]+$/;
      if(event.target.value.match(numbers))
      {
        this.onKey(event,i,r,a);
      }else{
        this.snackBar.open("Field can't be Empty", 'X', {
            duration: 5000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: "top",
        });
      }
  }

    //checkBox
    checkBox(eve,i,r,a){
      this.beforeValue = !(eve.checked); // for activity logs
      this.boardheads[i].boards[r].tab[a] = eve.checked;
      if(this.dbResult != '' && typeof this.dbResult != 'undefined'){
        this.updateBoard('row',r,a,this.boardheads[i].groupid,this.boardheads[i].boards);
      }else{
        this.insertBoard(this.loggedId,this.boardheads);
      }
    }


    //link data update
    linkUpdate(eve,group,row,col){
      this.beforeValue =  this.boardheads[group].boards[row].tab[col]; // for activity logs
      eve.stopPropagation();
      (<HTMLInputElement>document.getElementById('link'+group+row+col)).style.display="block";
    }

    closeUrlBox(eve,group,row,col){
      eve.stopPropagation();
      (<HTMLInputElement>document.getElementById('link'+group+row+col)).style.display="none";
    }

   afterSubmitUrl(i,r,a){
    let url:any = (<HTMLInputElement>document.getElementById('url'+i+r+a)).value;
    let name:any = (<HTMLInputElement>document.getElementById('urlname'+i+r+a)).value;

    let link:any ={"url": url, "name": name};

    this.boardheads[i].boards[r].tab[a] = link;
    if(this.dbResult != '' && typeof this.dbResult != 'undefined'){
      this.updateBoard('row',r,a,this.boardheads[i].groupid,this.boardheads[i].boards);
    }else{
      this.insertBoard(this.loggedId,this.boardheads);
    }
    (<HTMLInputElement>document.getElementById('link'+i+r+a)).style.display="none";
  }

    /* Relational Col Of Subtraction & Percentage Dialog Box */
  _relationalCols(type,groupId) {
      this.dialogRef = this._matDialog.open(RelationsColsComponent, {
        width:'250px',
        disableClose: true,
        data: {
            loginId : localStorage.getItem('userToken'),
            group : groupId ,
            boardheadings: this.boardheads[groupId].heading,
            type:type
        }
      });
      this.dialogRef.afterClosed().subscribe(response => {
         this.getRelationdata();
      });
  }

  relationalChange_boolean(group,row,col) {
    if(group == this._rgrp && row == this._rrow && col == this._rcol){
      return true;
    }else {
     return false;
    }
  } //end relationalChange_boolean

  relationalChange_clk(group,row,col) {
    this.beforeValue =  this.boardheads[group].boards[row].tab[col]; // for activity logs
    this._rgrp = group;
    this._rrow = row;
    this._rcol = col;
  }

  relationalChange($event,group,row,col) {
    this.boardheads[group].boards[row].tab[col] = $event.target.value;
    this.updateBoard('row',row,col,this.boardheads[group].groupid,this.boardheads[group].boards);
    this._rgrp = null;
    this._rrow = null;
    this._rcol = null;
    this.relationalChange_boolean(group,row,col);
  } //end relationalChange

  __relational_vals(group,row,col,type) {
    let relationalVal:any;
    for(let r = 0; r < this.relationalCols.Result.length; r++) {
      if(col ==  this.relationalCols.Result[r].col_location) { //relatedto_location
        let ralation_ : any = this.boardheads[group].boards[row].tab[this.relationalCols.Result[r].relatedto_location];
        let col_:any = this.boardheads[group].boards[row].tab[col];
        switch(type) {
          case "comission":
          relationalVal = ralation_ - col_;
           break;

          case "substraction":
          relationalVal =  ralation_ - col_;
            break;

          case "percentage":
            relationalVal =  (ralation_ * col_) / 100;
            break;
            default:
            relationalVal =  ralation_ - col_;
        } //end switch
        return relationalVal;
      } else  {
        relationalVal = this.boardheads[group].boards[row].tab[col];
      } //endif
    } //endfor
      return relationalVal;
   } //end _relational_vals

   deleteRel(tag,col){
    const data ={
       tag:tag,
       col:col
    }
    this._taskboardservice.deleteRelationCol(data).then(res=>{
        // console.log(res);
    });
  }

  //invite users
  invitePerson(event,group,row,col,flag){
    if(flag == 'y'){
      Swal('Already Invited.');
    }else{
        let id= 'uname'+group+'_'+row+'_'+col;
        let unameVal:any='';
        this.dialogRef = this._matDialog.open(ChoosePersonComponent, {
            panelClass: 'person-form-dialog',
            data      : {
                uname:event.target.innerText
            }
        });
        this.dialogRef.afterClosed()
        .subscribe(response => {
            if ( !response )
            {
                return;
            }
            unameVal = response;
            this.inviteIndex = ""+group+row;
            if(unameVal){
              this.inviteBoolean(group,row);
            }
            let Email:any = this.personDetails.find(x => x.id === unameVal.id).email;
            this.personDetails.firstChar = unameVal.fullName.charAt(0);
            let personNew = this.personDetails.find(x => x.id === unameVal.id);

            const invitedata={
              groupid:this.boardheads[group].groupid,
              tabid:row,
              from:this.loggedId,
              to:personNew.token,
              email:Email
            }
            //send invite
            this._taskboardservice.sendInvite(invitedata).then(data=>{
              if(data.statusCode == '1'){
                Swal('Invite has been sent.');
                this.boardheads[group].boards[row].tab[col] = personNew.id;
                if(this.dbResult != '' && typeof this.dbResult != 'undefined'){
                  this.updateBoard('row',row,col,this.boardheads[group].groupid,this.boardheads[group].boards);
                }else{
                  this.insertBoard(this.loggedId,this.boardheads);
                }
                }else{
                alert('Invite cant send');
              }
            });
         });
      }
   }

  inviteBoolean(i,r){
    let gr = ""+i+r;
     if(this.inviteIndex == gr) {
       return true;
     }else {
       return false;
     }
  }

  //countries list
  onCountrySelect(item: any,i,r,a) {
    //alert('selected');
    this.selecteCountry = item;
    this.boardheads[i].boards[r].tab[a] = this.selecteCountry.name;
    this.editRow_grp = null;
    this.editRow_row = null;
    this.editRow_col = null;
    this.editRow(i,r,a);
      if(this.dbResult != '' && typeof this.dbResult != 'undefined'){
        this.updateBoard('row',r,a,this.boardheads[i].groupid,this.boardheads[i].boards);
      }else{
        this.insertBoard(this.loggedId,this.boardheads);
      }
  }

  onCountryChangedEvent(val: string) {
    this.CountryChanged = val;
  }


  changeTimeline_date(refValue,event,group,Row,Col,dateType) : void {
    this.beforeValue =  this.boardheads[group].boards[Row].tab[Col]; // for activity logs
    let timeline:any;
    //this.boardheads[group].boards[Row].tab[Col] = event.target.value._d;
    var ChangedDate = this.datePipe.transform(event.target.value._d, 'yyyy,M,dd');
    ChangedDate = new FormControl(new Date(ChangedDate)).value;
    if(dateType == 'end'){
      timeline = {"start":this.boardheads[group].boards[Row].tab[Col]['start'],"end":ChangedDate}
    }else if(dateType =='start'){
      this.minEndDate = moment(refValue).toDate();
      //timeline = {"start": ChangedDate,"end":this.boardheads[group].boards[Row].tab[Col]['end']}
      timeline = {"start": ChangedDate,"end":""}
    }
    this.boardheads[group].boards[Row].tab[Col] = timeline;
    if(this.dbResult != '' && typeof this.dbResult != 'undefined'){
      if(this.boardheads[group].boards[Row].tab[Col]['start'] !== '' && this.boardheads[group].boards[Row].tab[Col]['end'] !== ''){
          this.updateBoard('row',Row,Col,this.boardheads[group].groupid,this.boardheads[group].boards);
          this.editRow_grp = null;
          this.editRow_row = null;
          this.editRow_col = null;
          this.editRow(group,Row,Col);
       }
     }else{
        this.insertBoard(this.loggedId,this.boardheads);
      }
   }

  ClkTimeline_editRow (group,Row,Col,dateType) : void {
    this.editRow_grp = group;
    this.editRow_row = Row;
    this.editRow_col = Col;
    this.editRow(group,Row,Col);
  }

  // on timeline mouse hover
  timelineMouseOver(group,row,start,end) {
    //this.timelineColor = false;
    this.timelineIndex = ""+group+row;
    let startDate:any = new Date(start);
    let endDate:any = new Date(end);
    let dayDiffValue = (endDate - startDate)  / 1000 / 60 / 60 / 24;
    if(isNaN(dayDiffValue)) {
      this.dayDiff = "Not Selected";
    } else {
      this.dayDiff = dayDiffValue;
    }
  }

  timelineColor(group,row,dayDiff){
    let gr = ""+group+row;
    if(this.timelineIndex == gr && this.dayDiff <= 15) {
      return true;
    }else {
      return false;
    }
  }

  timelineMouseLeave(group,row,start,end) {
    this.timelineIndex = null;
  }

  timelineOverStatus(group,row) {
    let gr = ""+group+row;
    if(this.timelineIndex == gr) {
      return true;
    }
    else {
      return false;
    }
  }

  onActivity(grp,row,col) {
      this.attachmentToggle = false;
      this.notesToggle = false;
      this.grpAl = grp;
      this.rowAl = row;
      this.sidenav.toggle();
      if(this.boardheads[grp].groupid !== ''){
        let data = {
          "groupid" : this.boardheads[grp].groupid,
          "rowindex" : row
        };
        this._taskboardservice.getActivityLog(data);
        this._taskboardservice.getAttachments(data);
        this._taskboardservice.getNotes(data);
      }
    }


/* toggle Attachments */
onOpenAttachment() {
  this.attachmentToggle = !this.attachmentToggle;
}

 /* toggle Notes */
 onOpenNotes() {
  this.notesToggle = !this.notesToggle;
  this.editorContent = "";
}

 /* Add Attachments in Tabular */
 onAddAttachment(attachFormValue) {
   this.loading = true;
   let formData: FormData = new FormData();
      formData.append('boardId', this.boardId);
      formData.append('groupId', this.boardheads[this.grpAl].groupid);
      formData.append('rowIndex', String(this.rowAl));
      formData.append('fileName', attachFormValue.alFileName);
      formData.append('notes', attachFormValue.alFileNote);
      formData.append('userToken', localStorage.getItem('userToken'));
      formData.append('file', this.attachmentFile);

  //let res:any = this._taskboardservice.storeAttachments(formData)
  this._taskboardservice.storeAttachments(formData).subscribe(
    (res) => {
      this.loading = false;
      let result:any = res;
      if (result.statusCode == 1) {
        let data = {
          "groupid" : this.boardheads[this.grpAl].groupid,
          "rowindex" : String(this.rowAl)
        };
        this._taskboardservice.getAttachments(data);
        this.attachmentToggle = !this.attachmentToggle;

      }
    }
  )}

  /* Upload Attachments in Tabular */
  uploadAttachments(e) {
    this.attachmentFile = e.target.files[0];
  }

 /* Delete Attachment in Tabular */
  onAttachmentDelete(rowId) {
    let data = {
      'aid':rowId
    }

    let fetchData = {
      "groupid" : this.boardheads[this.grpAl].groupid,
      "rowindex" : String(this.rowAl)
    };
    this._taskboardservice.deleteAttachments(data).subscribe(
      (response) => {
        if(response.statusCode == "200"){
          this._taskboardservice.getAttachments(fetchData);
          this.snackBar.open(response.statusMessage, 'X', {
              duration: 5000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
        }
      }
    )
  }

  /* Download Attachment in Tabular*/
  onAttachmentDownload(id) {
    // const downloadID = {
    //   "aid":id
    // }
    // this._taskboardservice.downloadAttachment(downloadID).subscribe(
    //   (res)=>{
    //     console.log(res,"ress");
    //   }
    // )
  }

  /* Save Notes in Tabular */
  SaveNotes(notes){
    if(notes){
      this.loading = true;
          const notesData = {
            'boardId' : this.boardId,
            'groupId': this.boardheads[this.grpAl].groupid,
            'rowIndex': String(this.rowAl),
            'userToken': localStorage.getItem('userToken'),
            'notes': notes
          }

          let fetchNotesData = {
            "groupid" : this.boardheads[this.grpAl].groupid,
            "rowindex" : String(this.rowAl)
          };
          this._taskboardservice.storeNotes(notesData).subscribe(
            (resp) => {
              this.loading = false;
              if(resp.statusCode == '200'){
                this.notesToggle = !this.notesToggle;
                this._taskboardservice.getNotes(fetchNotesData);
                this.snackBar.open(resp.statusMessage, 'X', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
              }else{
                this.snackBar.open(resp.statusMessage, 'X', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                  });
              }
            }
          )
       }
   }

  /* Notes Delete in Tabular */
    onNotesDelete(id){
      const notesID = {
        "noteId":id
      }
      let fetchNotesData = {
        "groupid" : this.boardheads[this.grpAl].groupid,
        "rowindex" : String(this.rowAl)
      };

      this._taskboardservice.deleteNotes(notesID).subscribe(
        (resp)=>{
          if(resp.statusCode == "200"){
            this._taskboardservice.getNotes(fetchNotesData);
            this.snackBar.open(resp.statusMessage, 'X', {
                duration: 5000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
          }else{
            this.snackBar.open(resp.statusMessage, 'X', {
                duration: 5000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
          }
        }
      )
    }
}
