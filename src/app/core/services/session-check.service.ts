// import { JwtHelper } from 'angular2-jwt';
// import { Injectable, Injector } from '@angular/core';
// import { AuthService } from 'app/core/services/auth.service';
// import { Observable } from 'rxjs/Observable';
// import { Router } from '@angular/router';

// @Injectable()
// export class SessionCheckService{
//     constructor(
//         private jwtHelper:JwtHelper,
//         private inj: Injector
//     ){}
   

//     validate(): Observable<any>{
//        const authService = this.inj.get(AuthService);
//         return Observable.interval(1000).map(
//             (x)=>{
//                 this.jwtHelper.isTokenExpired(token)
//             }
//         )
//     }
// }