import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class EcommerceOrderService implements Resolve<any>
{
    routeParams: any;
    order: any;
    onOrderChanged: BehaviorSubject<any>;
    temp;
    products;
    temp2;
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
        this.onOrderChanged = new BehaviorSubject({});
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
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getOrder()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get order
     *
     * @returns {Promise<any>}
     */
    getOrder(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            const params = new HttpParams().set('reference', this.routeParams.id );
            this._httpClient.get(this.baseUrl + '/showsingleOrder', {params: params})
                .subscribe((response: any) => {
                    // console.log(response);
                    this.temp = response;
                    this.order = this.temp.Result[0];
                    
                    this.onOrderChanged.next(this.order);
                    
                    resolve(response);
                }, reject);
        });
    }
    getProducts(custId): any {
        const params = new HttpParams().set('customerId', custId );
        this._httpClient.get(this.baseUrl + '/showproductsAgainstCust', {params: params}).subscribe
        (
            data => {
                // console.log(data);
                this.temp2 = data;
                this.products = this.temp2.Result;
                return this.products;
            }
        );
    }

    /**
     * Save order
     *
     * @param order
     * @returns {Promise<any>}
     */
    saveOrder(order): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/e-commerce-orders/' + order.id, order)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Add order
     *
     * @param order
     * @returns {Promise<any>}
     */
    addOrder(order): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/e-commerce-orders/', order)
                .subscribe((response: any) => {
                    
                    resolve(response);
                }, reject);
        });
    }
    
}
