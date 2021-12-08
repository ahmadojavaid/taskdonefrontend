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
  selector: 'app-yahoo',
  animations   : fuseAnimations,
  templateUrl: './yahoo.component.html',
  styleUrls: ['./yahoo.component.scss']
})

export class YahooComponent implements OnInit {	
	
	yahooForm: FormGroup;
	yahooFormErrors: any;
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
        this.yahooFormErrors = {
            email   	: {},
            password	: {},
            inbox		: {}
        };
	}
 
    ngOnInit() : void{
        this.yahooForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
 
    get f() { return this.yahooForm.controls; }
 
    onSubmit(): void {
        if (this.yahooForm.invalid) {
            return;
        } 
		
		if(this.submitted) {	  return;	}
		/* this.submitted = true; */
		
		let loginUserId = localStorage.getItem('userToken');
		let data = this.yahooForm.getRawValue();
		let body = {
				userToken: loginUserId,
				type: 'yahoo',
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
