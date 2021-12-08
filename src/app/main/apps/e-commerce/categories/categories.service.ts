import { environment } from 'environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from '../../../../../../node_modules/rxjs';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
    allCategoories;
    baseUrl = environment.baseUrl;
    temp;
  constructor(private _httpClient: HttpClient) { }
  // tslint:disable-next-line:typedef
  getCategories() {
        
    
        return this._httpClient.get(this.baseUrl + '/category');
           
    }
}

