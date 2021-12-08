import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class EcommerceOrdersService implements Resolve<any>
{
    orders: any[] = [];
    temp;
    onOrdersChanged: BehaviorSubject<any>;
    baseUrl = environment.baseUrl;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onOrdersChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getOrders()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get orders
     *
     * @returns {Promise<any>}
     */
    getOrders(): Promise<any>
    {
         return new Promise((resolve, reject) => {
           this._httpClient.get(this.baseUrl + '/order')
                .subscribe((response: any) => {
                    console.log(response);
                    this.temp = response;

                    // for (let i = 0; i < this.temp.Result.length; i++ ) {
                    //     const orderNode = {
                    //         customer: {
                    //             id: this.temp.Result[i].customers_Id,
                    //             firstname: this.temp.Result[i].firstName,
                    //             lastName: this.temp.Result[i].lastName,
                    //             company: this.temp.Result[i].company,
                    //             email: this.temp.Result[i].firstName.email,
                    //             invoiceAddress: {
                    //                 address: this.temp.Result[i].invoiceAddress
                    //             }, 
                    //             phone: this.temp.Result[i].phone,
                    //             shippingAddress: {
                    //                 address: this.temp.Result[i].shippingAddress
                    //             }
                    //         },
                    //         date: this.temp.Result[i].date,
                    //         discount: this.temp.Result[i].discount,
                    //         payment: {
                    //             method: this.temp.Result[i].method,
                    //             transactionId: this.temp.Result[i].transactionId
                    //         },
                    //         products: [
                    //             {
                    //                 id: this.temp.Result[i].products_Id,
                    //                 name:  this.temp.Result[i].name
                    //             }
                    //         ],
                            
    
                            
                    //     };
                    //     console.log(orderNode);
                    // }
                    
                    for (let i = 0;  i < this.temp.Result.length; i++) {
                        if (this.temp.Result[i].orders.length > 0) {
                            this.orders.push(this.temp.Result[i]);    
                        } else{
                            console.log('customer found without Order');
                        }
                        console.log(this.orders);
                    }
                    // this.orders = this.temp.Result;
                    this.onOrdersChanged.next(this.orders);
                    resolve(response);
                }, reject);
        });
        //  return new Promise((resolve, reject) => {
        //     this._httpClient.get('api/e-commerce-orders')
        //         .subscribe((response: any) => {
        //             console.log(response);
        //             this.orders = response;
        //             this.onOrdersChanged.next(this.orders);
        //             resolve(response);
        //         }, reject);
        // }); 
    }
}
