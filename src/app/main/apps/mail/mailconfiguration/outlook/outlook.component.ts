import { Component, OnInit, NgModule } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Observable, EMPTY, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-outlook',  
  animations   : fuseAnimations,
  templateUrl: './outlook.component.html',
  styleUrls: ['./outlook.component.scss']
})
export class OutlookComponent implements OnInit {

  	outlookForm: FormGroup;
    gmailFormErrors: any;
	temp;
    submitted = false;
	baseUrl = environment.baseUrl;
 
    constructor(
	private formBuilder: FormBuilder, 
	private _httpClient: HttpClient,
	private router: Router
	) 
	{
		// Set the defaults
        this.gmailFormErrors = {
            email   	: {},
            password	: {}/* ,
            inbox		: {} */
        };
	}
 
    ngOnInit() {		
		
        this.outlookForm = this.formBuilder.group({
            /* inbox: ['', Validators.required], */
            email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
 
    get f() { return this.outlookForm.controls; }
 
    onSubmit() {
   
        if (this.outlookForm.invalid) {
            return;
        } 
		
		if(this.submitted) {	  return;	}
		/* this.submitted = true; */
		let loginUserId = localStorage.getItem('userToken');
		let data = this.outlookForm.getRawValue();
		let body = {
				userToken: loginUserId,
				/* inbox: data.inbox, */
				type: 'outlook',
				email: data.email,
				password: data.password
				};	
		
		this._httpClient.post(this.baseUrl + '/mail-configure', body).subscribe(
            response => {
				this.temp = response;
				if (this.temp.statusCode ===  '0') {
					alert(this.temp.statusMessage);
				}
				else if(this.temp.statusCode ===  '1'){
					alert(this.temp.statusMessage);
					this.router.navigate(['/apps/mail/mail-configuration']);
				}
				else
				{
					alert(this.temp.statusMessage);
				}
			}			
        );
    } 

}
