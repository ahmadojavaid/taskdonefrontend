import { Component, OnInit, EventEmitter, Input, Output, ViewChild,OnDestroy } from '@angular/core';
import {Location} from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router,ActivatedRoute } from '../../../../../../../node_modules/@angular/router';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';

import {TaskboardClass} from '../class/taskboard-class';
import { TaskboardService } from '../services/taskboard.service';
import { TaskboardStatusClass } from '../class/status-option-class';
import { TabularService } from 'app/main/apps/scrumboard/tablular-list/services/tabular.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-board-name',
  templateUrl: './edit-board-name.component.html',
  styleUrls: ['./edit-board-name.component.scss']
})
export class EditBoardNameComponent implements OnDestroy {

  formActive: boolean;
  form: FormGroup;

  @Input()
  board;

  @Output()
  onNameChanged: EventEmitter<any>;

  @Input() boardDataEvent;

  @ViewChild('nameInput')
  nameInputField;

  defaultname = 'Start from scratch';
  //defaultname:any;
  dbData:any;
  result:any;
  taskboardclass = new TaskboardClass();
  boardheads = this.taskboardclass.defaultBoards;
  statusoptions=new TaskboardStatusClass();
  options:any = this.statusoptions.StatusList[0].status;
  boardId:any;
  boardStatus:number = 3;
  user_token = localStorage.getItem('userToken');
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  constructor(
    private _formBuilder: FormBuilder,
    private _httpClient: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private _location : Location,
    private _taskboardService: TaskboardService,
    private _tabularService: TabularService
  )
  {
     this.route.queryParams.subscribe( queryParams => { this.boardId = queryParams.id});
      // Set the defaults
      if(!this.boardId){
        this.openForm(this.defaultname.toUpperCase());
      }
      this.onNameChanged = new EventEmitter();
  }


    ngOnInit() {
      this.getBoardName();
      if(this.boardId){
        this.getStatusOptionList();
      }
   }

     onBack(){
       this._location.back();
     }

    /* Get Board Name */
    getBoardName(){
      if(this.boardId){
         let data = {
           "boardId" : this.boardId
         }
        this._tabularService.getBoardNameTabular(data).subscribe(data => {
             this.result = data;
             if(this.result.statusCode == '200'){
                this.defaultname = this.result.boardResult[0].project_name;
                this.boardStatus = this.result.boardResult[0].status;
                this.dbData = this.result.boardResult[0].project_name;
             }else if(this.result.statusCode == '400'){
                 this.snackBar.open(this.result.statusMessage, 'X', {
                     duration: 5000,
                     horizontalPosition: this.horizontalPosition,
                     verticalPosition: "top",
                 });
             }else if(this.result.statusCode == '1000'){
                 this.snackBar.open(this.result.statusMessage, 'X', {
                     duration: 5000,
                     horizontalPosition: this.horizontalPosition,
                     verticalPosition: "top",
                 });
                 setInterval(() => {
                   localStorage.removeItem('userToken');
                   this.router.navigate(['/pages/auth/login-2']);
                },3000);
             }
          });
      }else{
        console.log("Board not Found");
     }
  }

    /* Get Status Option List */
    getStatusOptionList(){
      if(this.boardId){
        const statusData = {
           token :this.user_token,
           tag : 'insert',
           bid : this.boardId,
           option : this.options
        }
        this._taskboardService.statusOptions(statusData).then(res=>{
            //console.log('status insert',res);
            //this.boardId = res.id;
        })
      }
    }

    /* Open Board Name Form */
    openForm(defaultBoardName):void {
      this.form = this._formBuilder.group({
        name: [defaultBoardName]
      });
      this.formActive = true;
    }

   /* On Board Name Form Submit */
    onFormSubmit(form,value,type): void{
        if (this.form.valid ){
          console.log('this.dbData: '+this.dbData,this.boardId,typeof this.dbData != 'undefined');
          this.defaultname = this.form.getRawValue().name;
          if(typeof this.dbData != 'undefined' && type == 'templateUpdate' || type == 'projectUpdate' || type == 'bothUpdate'){
                let data ={
                   token : localStorage.getItem('userToken'),
                   boardName : this.form.getRawValue().name,
                   status : value,
                   boardId : this.boardId
                }
                this._tabularService.updateTemplateProject(data).subscribe(
                  (resp)=> {
                      if(resp.statusCode == '200'){
                        Swal('Success...', resp.statusMessage, 'success');
                      }else{
                        Swal('Oops...', resp.statusMessage, 'error');
                      }
                });
              }else{
                  console.log('board name new: ',this.boardDataEvent);
                  const boardData={
                     token : localStorage.getItem('userToken'),
                     boardName : this.form.getRawValue().name,
                     status : value,
                  }
                this._tabularService.createTemplateProject(boardData).subscribe(
                  (resp)=>{
                    if(resp.statusCode == '200'){
                      this.boardId = resp.id;
                      this.boardStatus = value;
                      this.dbData = this.form.getRawValue().name;
                      this.router.navigate(['.'], { relativeTo: this.route, queryParams: {id:resp.id}});
                      if(typeof this.boardDataEvent !== 'undefined'){
                        this.insertBoard(this.user_token,this.boardDataEvent);
                      }
                      Swal('Success...', resp.statusMessage, 'success');
                    }else{
                      Swal('Oops...', resp.statusMessage, 'error');
                    }
                  }
                )
              }
              this.formActive = false;
          }
      }

  /* Insert Group Data after New Project & Template Created */
     insertBoard(uid,boards){
       const data={
         token : uid,
         board_id:this.boardId,
         data : boards
       }
       this._tabularService.createGroupDataTabular(data).subscribe(
         (response) => {
            if(response.statusCode == '200'){
              //this.checkDB();
           }
        })
      }

   /* fetch Group data for Projects & Templates */
   checkDB(){
     if(this.boardId){
       let data = {
         "boardId":this.boardId
       }
       this._tabularService.getGroupDataTabular(data).subscribe(
         (response) => {
            if(response.statusCode == '200'){
              if(response.Result.length !== 0){

            }else{
              this.boardheads = this.taskboardclass.defaultBoards;
            }
         }
       })
    }
 }

    /* Close Board Form */
    closeForm():void {
      this.formActive = false;
    }

  /* Destroy Component & set boardID default to 3 */
  ngOnDestroy(){
      this.boardStatus = 3;
    }
}
