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
  selector: 'app-custom',
  animations   : fuseAnimations,
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss']
})


export class CustomComponent implements OnInit {
	
	customForm: FormGroup;
    customFormErrors: any;
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
        this.customFormErrors = {
            email   	: {},
            password	: {},
            inbox		: {},
            port		: {},
        };
	}
 
    ngOnInit(): void  {
        this.customForm = this.formBuilder.group({
            inbox: ['', Validators.required],
            port: ['', Validators.required],
            email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
 
    // convenience getter for easy access to form fields
    get f() { return this.customForm.controls; }
 
    onSubmit(): void  {
        if (this.customForm.invalid) {
            return;
        } 
		if(this.submitted) {	  return;	}
		/* this.submitted = true; */
		let loginUserId = localStorage.getItem('userToken');
		let data = this.customForm.getRawValue();
		let body = {
				userToken: loginUserId,
				inbox: data.inbox,
				type: 'cusom',
				email: data.email,
				port: data.port,
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
