import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate {
    userToken: Subscription;

    constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {
        const token = localStorage.getItem('userToken');
        const helper = new JwtHelperService();
        const isExpired = helper.isTokenExpired(token);
        if (localStorage.getItem('userToken') &&  isExpired === false  ) {
            return true;
        } else {
            console.log('false');
            this.router.navigate(['/pages/login-2']);
            return false;
        }

  }
// tslint:disable-next-line:typedef
// canLoad() {
//     console.log(localStorage.getItem('userToken'));
//     if (localStorage.getItem('userToken')) {
//         console.log('true');
//         return true;
//     } else {
//         console.log('false');
//             return false;
//     }

// }
}
