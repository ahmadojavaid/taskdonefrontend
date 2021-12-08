
import { fuseAnimations } from '@fuse/animations';
import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-order-enter-user',
  templateUrl: './order-enter-user.component.html',
  styleUrls: ['./order-enter-user.component.scss'],
  animations   : fuseAnimations
})
export class OrderEnterUserComponent implements OnInit, OnDestroy {

    form: FormGroup;
    formErrors: any;
    temp;
    fileToUpload;
    filestring;
    baseUrl = environment.baseUrl;
    private _unsubscribeAll: Subject<any>;
    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private http: HttpClient,
        private _matSnackBar: MatSnackBar
    ) {
         // Reactive form errors
         this.formErrors = {
            company   : {},
            firstName : {},
            lastName  : {},
            email     : {},
            phoneNumber: {},
            address   : {},
            city      : {},
            state     : {},
            postalCode: {},
            country   : {},
            address2   : {},
            city2      : {},
            state2     : {},
            postalCode2: {},
            country2   : {}
        };
     }

  // tslint:disable-next-line:typedef
  ngOnInit() {
       this.form = this.createUserForm();

   /* this.form.valueChanges
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
            this.onFormValuesChanged();
        });
*/
  }
  createUserForm(): FormGroup {
      return this._formBuilder.group({
        company   : ['', Validators.required],
        firstName : ['', Validators.required],
        lastName  : ['', Validators.required],
        address   : ['', Validators.required],
        email     : ['', Validators.required],
        phoneNumber: ['', Validators.required],
        city      : ['', Validators.required],
        state     : ['', Validators.required],
        postalCode: ['', [Validators.required, Validators.maxLength(5)]],
        country   : ['', Validators.required],
        address2   : ['', Validators.required],
        city2      : ['', Validators.required],
        state2     : ['', Validators.required],
        postalCode2: ['', [Validators.required, Validators.maxLength(5)]],
        country2   : ['', Validators.required]
    });
  }
  ngOnDestroy(): void
    {
        /* Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();*/
    }
    onFormValuesChanged(): void
    {
        for ( const field in this.formErrors )
        {
            if ( !this.formErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.formErrors[field] = {};

            // Get the control
            const control = this.form.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.formErrors[field] = control.errors;
            }
        }
    }
    onSaveUser(): void {
        const data = this.form.getRawValue();
    //    console.log(data);
       const body = {
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        email: data.email,
        phone: data.phoneNumber,
        invoiceAddress: data.address + ',' + data.city + ',' + data.state + ',' + data.postalCode ,
        shippingAddress: data.address2 + ',' + data.city2 + ',' + data.state2 + ',' + data.postalCode2 ,
        avatar: this.filestring


       };
        this.http.post( this.baseUrl + '/customer', body).subscribe(
            response => {
                // console.log(response);
                this.temp = response;
                this._matSnackBar.open('User Created ', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
                const userId = this.temp.Result.id || 1;
        this.router.navigate(['/apps/e-commerce/make-order/order-select-product',  userId]);
            }
        );
        
    }
    handleFileInput(files: FileList): void {
        // //  console.log(files);
          this.fileToUpload = files.item(0);
        //   console.log(this.fileToUpload);
          const reader = new FileReader();
          reader.onload = this._handleReaderLoaded.bind(this);
          reader.readAsBinaryString(files.item(0));
        }
        _handleReaderLoaded(readerEvt): void {
          const binaryString = readerEvt.target.result;
           this.filestring = (btoa(binaryString));
        //    console.log(this.filestring);
          
          
     }

    onUpload(event): void {
        // console.log(event.files);
        const files = event.files;
        // //  console.log(files);
        this.fileToUpload = files[0];
        // console.log(this.fileToUpload);
        const reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
            
     
          reader.readAsBinaryString(files[0]);       
                    
               
        
       
    }

}
