import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { orderStatuses } from 'app/main/apps/e-commerce/order/order-statuses';
import { Order } from 'app/main/apps/e-commerce/order/order.model';
import { EcommerceOrderService } from 'app/main/apps/e-commerce/order/order.service';
import { environment } from 'environments/environment';

@Component({
    selector     : 'e-commerce-order',
    templateUrl  : './order.component.html',
    styleUrls    : ['./order.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class EcommerceOrderComponent implements OnInit, OnDestroy
{
    order;
    orderStatuses: any;
    statusForm: FormGroup;
    products;
    currentReference;
    baseUrl = environment.baseUrl;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {EcommerceOrderService} _ecommerceOrderService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _ecommerceOrderService: EcommerceOrderService,
        private _formBuilder: FormBuilder,
        private _http: HttpClient,
        private _router: ActivatedRoute
    )
    {
        // Set the defaults
        // this.order = new Order();
        this.orderStatuses = orderStatuses;

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
        // Subscribe to update order on changes
        this._ecommerceOrderService.onOrderChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(order => {
                this.order = order;
            });

        this.statusForm = this._formBuilder.group({
            newStatus: ['']
        });
        // console.log(this.order);
        this._ecommerceOrderService.getProducts(this.order.customers.id);
        setTimeout(() => {
            this.products = this._ecommerceOrderService.products;
        // console.log(this.products);    
        }, 4000);
        
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
     * Update status
     */
    updateStatus(): void
    {
        const newStatusId = Number.parseInt(this.statusForm.get('newStatus').value);

        if ( !newStatusId )
        {
            return;
        }

        const newStatus = this.orderStatuses.find((status) => {
            return status.id === newStatusId;
        });

        newStatus['date'] = new Date().toString();

        this._router.params.subscribe( params1 => {
            this.currentReference = params1.id; 
     
            
         });
            const body = {};
            const status1 = this.statusForm.get('newStatus').value;
            const params = new HttpParams().set('reference', this.currentReference)
            .set('status', status1 );
            // console.log(params);
            this._http.post(this.baseUrl + '/updateOrderStatus', body, {params: params}).subscribe(
                data => {
                    // console.log(data);
                }
            );
        
    }
}
