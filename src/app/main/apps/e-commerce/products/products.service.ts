import { environment } from 'environments/environment';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../product/product.model';


@Injectable()
export class EcommerceProductsService implements Resolve<any>
{
    products: any[] = [];
    temp;
    baseUrl = environment.baseUrl;
    onProductsChanged: BehaviorSubject<any>;

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
        this.onProductsChanged = new BehaviorSubject({});
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
                this.getProducts()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get products
     *
     * @returns {Promise<any>}
     */
    getProducts(): Promise<any>
    
    {
        console.log(environment.baseUrl);
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.baseUrl + '/products')
                .subscribe((response: any) => {
                    this.temp = response;
                    // // console.log(this.temp.Result);
                   // this.products = this.temp.Result;
                   // this.products = [2, 3, 4, 8, 2, 3, 4];
                //    // console.log(this.products);
                   for (let i = 0; i < this.temp.Result.length; i++ ) {
                    //    console.log(this.temp.Result[i].id);
                    const persons = this.products.find(x => x.id === this.temp.Result[i].id);
                    // console.log('persons = ' + persons);
                    
              if (persons) {
                // console.log('found duplicate');
            } else {
                this.products.push(this.temp.Result[i]);
            }
                       
                   }
                //    console.log(this.products);

                    this.onProductsChanged.next(this.products);
                    resolve(response);
                }, reject);
        });
    }

}

