import { Router } from '@angular/router';
import { Component,OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-staus-dialog',
  templateUrl: './staus-dialog.component.html',
  styleUrls: ['./staus-dialog.component.scss']
})
export class StausDialogComponent implements OnInit {
  statusForm: FormGroup;
  event:any;
  action:any;
  dialogTitle:string;
  show:boolean = false;
  options:any = [{ 'name':'Done','color':'green'},{'name':'stuck','color':'red'},{'name':'working on it','color':'yellow'}];
   /**
     * Constructor
     *
     * @param {MatDialogRef<StausDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
      public matDialogRef: MatDialogRef<StausDialogComponent>,
      @Inject(MAT_DIALOG_DATA) private _data: any,
      private _formBuilder: FormBuilder,
      private Router: Router
  )
  {
      this.event = _data.event;
      this.action = _data.action;

      if ( this.action === 'oepnFrm' )
      {
            this.show=true;
      }
      else
      {

      }

      this.statusForm = new FormGroup({ title : new FormControl()});
  }

  ngOnInit() {
  }

  chooseOption(option){
    alert(this.options[option].name);
    this.matDialogRef.close(this.options[option].name);
  }
  onKey(event,i){
      alert(i+'------'+event.target.value);

  }

  openFrm(flag,frm){
    alert(flag+'------'+this.show+'******'+frm);
    if(flag == 't'){
      this.show=true;
    }else{
      // console.log(this.options);
      this.show=false;
      for(let n=0; n<this.options.length; n++){
         // alert((<HTMLInputElement>document.getElementsByName('status'+n)[0]).value);
          this.options[n].name=(<HTMLInputElement>document.getElementsByName('status'+n)[0]).value;
      }
    }

  }

}
