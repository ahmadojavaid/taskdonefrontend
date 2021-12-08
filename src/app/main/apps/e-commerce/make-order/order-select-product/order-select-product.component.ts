import { MatSnackBar } from '@angular/material';
import { fuseAnimations } from './../../../../../../@fuse/animations/index';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { duration } from 'moment';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-order-select-product',
  templateUrl: './order-select-product.component.html',
  styleUrls: ['./order-select-product.component.scss'],
  animations   : fuseAnimations
})
export class OrderSelectProductComponent implements OnInit, OnDestroy {
    form: FormGroup;
    formErrors: any;
    toppings = new FormControl();
    temp;
    temp2;
    userId;
    baseUrl = environment.baseUrl;

  toppingList = [];
  categoriesList = [];
    private _unsubscribeAll: Subject<any>;
    constructor(
        private _formBuilder: FormBuilder,
        private http: HttpClient,
        private route: ActivatedRoute,
        private _matSnackBar: MatSnackBar)
         {
         // Reactive form errors
         this.formErrors = {
            
            category   : {},
            discount   : {},
            transactionId   : {},
            method   : {},
            carrier   : {}
            
            
        };
     }

     ngOnInit(): void {
        // Reactive Form
        this.form = this.createFormValue();
        this.getCategories();
        this.createFormValue();
 
     
        
 
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
    createFormValue(): FormGroup {
        return this._formBuilder.group({
            category   : ['', Validators.required],
            discount   : ['', Validators.required],
            transactionId   : ['', Validators.required],
            method   : ['', Validators.required],
            carrier   : ['', Validators.required],
        });
    }
    getCategories(): void {
        this.http.get(this.baseUrl +  '/category').subscribe(
            data => {
                // console.log(data);
                this.temp = data;
                this.categoriesList = this.temp.Result;
            }
        );
    }
    createOrder(): void{
        const data = this.form.getRawValue();
        // console.log(data);
        this.route.params.subscribe( params1 => this.userId = params1 );
        const body = {
            customers_Id: this.userId.id,
            products_Id: this.toppings.value,
            transactionId: data.transactionId,
            method: data.method,
            discount: data.discount,
            carrier: data.carrier

            
        };
        // console.log(body);
        this.http.post(this.baseUrl +  '/order', body).subscribe(
            response => {
                // console.log(response);
                this._matSnackBar.open('Order Created', 'Oaky', {duration: 20000});
            }
        );
    }
    onSelectCategory(): void {
        const data = this.form.getRawValue();
        
        // console.log(data.category);
        const params = new HttpParams().set('CategoryId', data.category );
        this.http.get(this.baseUrl +  '/showProductsAgainstCAt', {params: params}).subscribe(
            response => {
                // console.log(response);
                this.temp2 = response;
                this.toppingList = this.temp2.Result;
                // console.log(this.temp2.Result);
            }
        );
    }
}
