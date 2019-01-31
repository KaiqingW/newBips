import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from 'app/core/services/auth.service';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private inj: Injector,
    private router: Router
    // private someSharedService: SomeSharedService
  ) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    if(!req.url.includes('https://maps.googleapis.com/maps/api') && !req.url.includes('https://query.yahooapis.com/v1/public/yql') && !req.url.includes('https://newsapi.org/v2/top-headlines?') && !req.url.includes('https://wwwcie.ups.com/rest/Rate')){
    const authService = this.inj.get(AuthService);
      req = req.clone({headers: req.headers.set('Authorization', `Bearer ${authService.getOrcaToken()}`,) });
      req = req.clone({ headers: req.headers.set('Accept', 'application/json',) });
      //kevin
      //   req = req.clone({ headers: req. headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT, OPTIONS') });
       req = req.clone({ headers: req.headers.append('Access-Control-Allow-Origin', '*') });
      //  req = req.clone({ headers: req.headers.append('Access-Control-Allow-Headers', "X-Requested-With, Content-Type") });
       //
      return next.handle(req);
      // .catch((error, caught) => {
      //   if (error.status === 401 || error.status ===403) {
      //     //logout users, redirect to login page
      //     authService.removeOrcaToken();
      //     //redirect to the signin page or show login modal here
      //     this.router.navigate(['/auth/login']); 
      //     return Observable.throw(error);
      // } else {
      //     return Observable.throw(error);
      // }
      // }) as any;
    }

    if(req.url.includes('https://maps.googleapis.com/maps/api') || req.url.includes('https://query.yahooapis.com/v1/public/yql') || req.url.includes('https://wwwcie.ups.com/rest/Rate')){
      // this.someSharedService.useGoogleMap = false;
      req = req.clone({ headers: req.headers.set('Accept', 'application/json')});
      //  req = req.clone({ headers: req. headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT, OPTIONS') });
      //  req = req.clone({ headers: req.headers.append('Access-Control-Allow-Origin', '*') });
      //  req = req.clone({ headers: req.headers.append('Access-Control-Allow-Headers', "X-Requested-With, Content-Type") });

      //kevin
     // req = req.clone({ headers: req.headers.set("Access-Control-Allow-Origin", "*") });
      //req = req.clone({ headers: req.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept") });
      return next.handle(req);
    }

   

  }
}
