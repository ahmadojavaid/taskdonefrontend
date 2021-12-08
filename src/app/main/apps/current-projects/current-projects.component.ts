import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef,MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { TabularService } from 'app/main/apps/scrumboard/tablular-list/services/tabular.service';
import { FuseCommonLoaderComponent } from '@fuse/components/common-loader/common-loader.component';

@Component({
  selector: 'app-current-projects',
  templateUrl: './current-projects.component.html',
  styleUrls: ['./current-projects.component.scss'],
  animations : fuseAnimations
})

export class CurrentProjectsComponent implements OnInit {
  public errorMessage:String;
  public projectList = [];
  public totalCount:number;
  cols: string = "3"
  start:number = 0;
  limit:number = 5;
  loadMoreButton:boolean = true;
  loadingValue:boolean = true;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

 constructor(
     private _router : Router,
     private _matDialog: MatDialog,
     private snackBar: MatSnackBar,
     private _tabularService : TabularService) {}

 ngOnInit() {
   this.getTemplateProject();
 }

 /* Get Templates from Service */
 getTemplateProject(){
    const data = {
       "status":0,
       "start":this.start,
       "limit":this.limit
   }
   this._tabularService.getTemplateProject(data).subscribe(
     (resp) => {
       this.loadingValue = false;
       if (resp.statusCode === "200") {
           this.totalCount = resp.totalCount;
           this.projectList = resp.projectList;
           if(this.projectList.length === this.totalCount)this.loadMoreButton = false;
         }else if(resp.statusCode === "400"){
           this.loadMoreButton = false;
           this.errorMessage = resp.statusMessage;
         }else if(resp.statusCode === "1000"){
           this.loadMoreButton = false;
           this.snackBar.open(resp.statusMessage, 'X', {
               duration: 5000,
               horizontalPosition: this.horizontalPosition,
               verticalPosition: "top",
           });
           setInterval(() => {
             localStorage.removeItem('userToken');
             this._router.navigate(['/pages/auth/login-2']);
          },3000);
         }
     })
   }

  /*Load More from Service */
  ehLoadMore(){
    this.start += this.limit;
      let loadData = {
         "status":0,
         "start":this.start,
         "limit":this.limit
     }
     this._tabularService.getTemplateProject(loadData).subscribe(
       (resp) => {
         this.loadingValue = false;
         if (resp.statusCode === "200") {
            this.totalCount = resp.totalCount;
             let loadproducts = resp.projectList;
              loadproducts.forEach((item, index) => {
                 this.projectList.push(item);
             });
             if(this.projectList.length === this.totalCount)this.loadMoreButton = false;
           }else if(resp.statusCode === "400"){
             this.loadMoreButton = false;
             this.errorMessage = resp.statusMessage;
           }else if(resp.statusCode === "1000"){
             this.loadMoreButton = false;
             this.snackBar.open(resp.statusMessage, 'X', {
                 duration: 5000,
                 horizontalPosition: this.horizontalPosition,
                 verticalPosition: "top",
             });
             setInterval(() => {
               localStorage.removeItem('userToken');
               this._router.navigate(['/pages/auth/login-2']);
            },3000);
          }
       })
     }


  /* On Board deleted */
  onBoardDelete(boardId,index){
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent,{
        disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete this Project ?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result){
            const deleteProjectData = {
              "board_id":boardId
            }
           this._tabularService.deleteGroupDataTabular(deleteProjectData).subscribe(
             (resp)=>{
               if(resp.statusCode == '200'){
                 this.snackBar.open("Project Deleted Successfully.",'X',{
                     duration: 5000,
                     horizontalPosition: this.horizontalPosition,
                     verticalPosition: this.verticalPosition,
                });
                this.projectList.splice(index, 1);
                this.start = 0;
                this.limit = 5;
                this.getTemplateProject();
              }else if(resp.statusCode == '400'){
                this.snackBar.open(resp.statusMessage, 'X',{
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                });
              }else if(resp.statusCode == '1000'){
                 this.snackBar.open(resp.statusMessage, 'X',{
                     duration: 5000,
                     horizontalPosition: this.horizontalPosition,
                     verticalPosition: this.verticalPosition,
                });
                setInterval(() => {
                  localStorage.removeItem('userToken');
                  this._router.navigate(['/pages/auth/login-2']);
               },3000);
               }
             })
           }
        this.confirmDialogRef = null;
    });

  }

   /* Re-direct to other Route */
   onRouterNavigate(id){
     if(id !== '0'){
       this._router.navigate(['/apps/scrumboard/boards/tabular'] ,{ queryParams:{id} });
     }else{
       this._router.navigate(['/apps/scrumboard/boards/tabular']);
     }
   }
}
