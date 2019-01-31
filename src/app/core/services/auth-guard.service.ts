// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { Injectable } from '@angular/core';
// import { AuthService } from './auth.service';
// import { Observable} from 'rxjs';

// Injectable()
// export class AuthGuard implements CanActivate{
//     constructor(private authService : AuthService){}

//     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
//         let url: string = state.url;
        
//         return this.checkLogin(url);
//     }

//     checkLogin(url: string): boolean {
//         if (this.authService.isLoggedIn) { return true; }
    
//         // Store the attempted URL for redirecting
//         this.authService.redirectUrl = url;
    
//         // Navigate to the login page with extras
//         this.router.navigate(['/login']);
//         return false;
//       }
// }