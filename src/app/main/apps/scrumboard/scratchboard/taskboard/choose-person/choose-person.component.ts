import { Component,OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup,FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef,MatAutocompleteModule,MatProgressSpinnerModule } from '@angular/material';
import {TaskboardPersonClass} from '../../class/person-class';
import {switchMap, debounceTime, tap, finalize,map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-choose-person',
  templateUrl: './choose-person.component.html',
  styleUrls: ['./choose-person.component.scss']
})
export class ChoosePersonComponent implements OnInit {
  myControl = new FormControl();
  personclass = new TaskboardPersonClass();
  personDetails:any; //this.personclass.PersonList.detail;
  options: any[] = this.personDetails;
  filteredOptions: Observable<string[]>;
  action: string;
  dialogRef: any;
  baseUrl = environment.baseUrl;
  Result;

  ngOnInit() {
   
    
      //get users list
      this._httpClient.get(this.baseUrl + '/person').subscribe(
        response => {
            //console.log(response);
            this.Result =response;
            if(this.Result.statusCode == '1'){
              //console.log('if---');
              this.personDetails = this.Result.Result;
             //to remove user from list which is logged in
              let index = this.personDetails.filter(item=>item.token !== localStorage.getItem('userToken'));
              this.options = index;
                //filter values
                this.filteredOptions = this.myControl.valueChanges
                .pipe(
                  startWith(''),
                  map(value => this._filter(value))
                );
            }else{
              //console.log('else----');
              this.personDetails = this.personclass.PersonList.detail;
              this.options = this.personDetails;
                //filter values
              this.filteredOptions = this.myControl.valueChanges
              .pipe(
                startWith(''),
                map(value => this._filter(value))
              );
            }
             //console.log('person details: '+ this.personDetails)
            
        });
  }
  
  private _filter(value: any): any[] {
    console.log('filter:'+value);
    const filterValue = value.toString().toLowerCase();
    return this.options.filter(option => option.fullName.toString().toLowerCase().includes(filterValue));
  }
  
    /**
     * Constructor
     *
     * @param {MatDialogRef<ChoosePersonComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ChoosePersonComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _httpClient: HttpClient,
        private router: Router
    )
    {
        // Set the defaults
        this.action = _data.uname;//this.myControl.value;
        console.log('group: '+ this.action);
        if(this.action != ''){
          this.myControl.setValue(this.action);
        }
        
    }

    displayFn(option): string {
      return option ? option.fullName : option;
    }

    saveValue(){
      //console.log(this.myControl.value);
       this.matDialogRef.close(this.myControl.value);
    }
}
