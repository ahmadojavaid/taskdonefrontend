import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '../../../../../../node_modules/@angular/router';

@Component({
    selector   : 'login-2',
    templateUrl: './login-2.component.html',
    styleUrls  : ['./login-2.component.scss'],
    animations : fuseAnimations
})
export class Login2Component implements OnInit, OnDestroy
{

//     jwtHelper: JwtHelper = new JwtHelper();

// useJwtHelper() {
//   var token = localStorage.getItem('token');

//   console.log(
//     this.jwtHelper.decodeToken(token),
//     this.jwtHelper.getTokenExpirationDate(token),
//     this.jwtHelper.isTokenExpired(token)
//   );
// }
    loginForm: FormGroup;
    loginFormErrors: any;
    temp;
    token = new Subject;
    baseUrl = environment.baseUrl;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _httpClient: HttpClient,
        private router: Router

    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar : {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer : {
                    hidden: true
                }
            }
        };

        // Set the defaults
        this.loginFormErrors = {
            email   : {},
            password: {}
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.loginForm.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.onLoginFormValuesChanged();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On form values changed
     */
    onLoginFormValuesChanged(): void
    {
        for ( const field in this.loginFormErrors )
        {
            if ( !this.loginFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }
    onLogin(): void {

        const data = this.loginForm.getRawValue();
        console.log(data);
        const body = {
            email: data.email,
            password: data.password
        };
        console.log(body);
        console.log(this.baseUrl);
        this._httpClient.post(this.baseUrl + '/doLogin', body).subscribe(
            response => {
                console.log(response);
                this.temp = response;
                if (this.temp.statusCode ===  '0') {
                    // this.matSnackBar.open('Invalid Credentials', 'Ok');
                    alert ('Invalid Credentials');

                } else if (this.temp.statusCode ===  '200') {
                    alert('Logged IN susscessfully');

                    localStorage.setItem('userToken', this.temp.Result.token );
                    //console.log(localStorage.getItem('userToken'));
                    this.router.navigate(['/apps/dashboards/analytics']);
                } else if (this.temp.statusCode ===  '403') {
                    alert('confirm email');
                    this.router.navigate(['/pages/auth/mail-confirm']);

                }
            }
        );
    }
}
