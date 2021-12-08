import { Component, OnInit, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MailconfigService } from '../service/mailconfig.service'

@Component({
  selector: 'app-gmail',
  animations   : fuseAnimations,
  templateUrl: './gmail.component.html',
  styleUrls: ['./gmail.component.scss']
})
export class GmailComponent implements OnInit {

	gmailForm: FormGroup;
  gmailFormErrors: any;
  submitted = false;
	temp;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  constructor(
  	private formBuilder: FormBuilder,
  	private _httpClient: HttpClient,
  	private router: Router,
    private snackBar: MatSnackBar,
    private _mailconfigService : MailconfigService
	)
	{
      this.gmailFormErrors = {
            email   	: {},
            password	: {}
        };
  }

    ngOnInit() {
        this.gmailForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    get f() { return this.gmailForm.controls; }

    // onSubmit() {
    //     if (this.gmailForm.invalid) {
    //         return;
    //     }
    //
		// if(this.submitted) { return;	}
		// this.submitted = true;
		// let loginUserId = localStorage.getItem('userToken');
		// let data = this.gmailForm.getRawValue();
		// let body = {
		// 		userToken: loginUserId,
		// 		type: 'gmail',
		// 		email: data.email,
		// 		password: data.password
		// 		};
    //
		// this._httpClient.post(this.baseUrl + '/mail-configure', body).subscribe(
    //         response => {
		// 		this.temp = response;
		// 		if (this.temp.statusCode ===  '0') {
		// 			this.submitted = false;
		// 			alert(this.temp.statusMessage);
		// 		}
		// 		else if(this.temp.statusCode ===  '1'){
		// 			this.router.navigate(['/apps/mail/mail-configuration']);
		// 		}
		// 		else
		// 		{
		// 			alert(this.temp.statusMessage);
		// 		}
		// 	}
    //     );
    // }

    onSubmit(formValues){
      if(this.gmailForm.valid){
          let data = {
            email:formValues.value.email,
            password:formValues.value.password,
            type:'gmail',
          }
        this._mailconfigService.mailConfigure(data).subscribe(
          (response) => {
              if(response.statusCode == "200"){
                this.snackBar.open(response.statusMessage, 'X', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: "top",
                });
              }else if(response.statusCode == "400"){
                this.snackBar.open(response.error, 'X', {
                    duration: 5000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: "top",
                });
              }else if(response.statusCode == "1000"){
                this.snackBar.open(response.statusMessage, 'X', {
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
        }
     }
}
