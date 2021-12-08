import { environment } from './../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.model';

@Injectable()
export class EcommerceProductService implements Resolve<any>
{
    routeParams: any;
    product: any;
    temp;
    onProductChanged: BehaviorSubject<any>;
    categories = [];
    temp2;
    categorySelected;
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
        this.onProductChanged = new BehaviorSubject({});
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
                this.getProduct()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get product
     *
     * @returns {Promise<any>}
     */
    getProduct(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if ( this.routeParams.id === 'new' )
            {
                this.onProductChanged.next(false);
                resolve(false);
            }
            else
            {
                this._httpClient.get(this.baseUrl + '/productDetail/' + this.routeParams.id)
                    .subscribe((response: any) => {
                        console.log(response);
                        this.temp = response;
                        console.log(this.temp.Result);
                        const product1 = this.temp.Result[0];
                        this.product = new Product(product1);
                        console.log(this.product);
                        console.log(this.temp.Result[0]);
                        // this.categorySelected = this.temp.Result[0].categories[0].id;

                        //  for (let i = 0; i < 1 ; i ++) {
                        //     console.log(this.product.categories);
                        //     this.product.categories[0] = this.changEvaluecategory(this.product.categories);
                        //  }
                        
                        
                        
                        this.onProductChanged.next(this.product);
                        resolve(response);
                    }, reject);
            }
        });
    }

    /**
     * Save product
     *
     * @param product
     * @returns {Promise<any>}
     */
    saveProduct(product): Promise<any>
    {   console.log(product);
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseUrl + '/products/' + product.id, product)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Add product
     *
     * @param product
     * @returns {Promise<any>}
     */
    addProduct(product): Promise<any>
    {
        console.log(product);
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.baseUrl + '/products', product)
                .subscribe((response: any) => {
                    resolve(response);
                    console.log(response);
                }, reject);
        });
    }
    changEvaluecategory (category): string {
        
        console.log('i m running');
        console.log(category);
        const category1 = category.id;
        console.log(category1);

        return category1;
    }
    getCategories(): Promise<any> {
        
        return new Promise((resolve, reject) => {
            this._httpClient.get(this.baseUrl + '/category')
                .subscribe((response: any) => {
                    resolve(response);                    
                }, reject);
        });

    }
}
