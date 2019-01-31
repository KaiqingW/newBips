import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreState, User } from 'app/core/models';
import { Router, ActivatedRoute, ParamMap, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from 'app/core/services/auth.service';
import * as fromAuthReducer from 'app/core/reducers/auth.reducer';
import * as AuthActions from 'app/core/actions/auth.action';
import { HttpClient } from '@angular/common/http';
// import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls:['./app.component.scss']
})


export class AppComponent implements OnInit {
  auth$: Observable<fromAuthReducer.State>;
  isLoading = false;

  constructor(
    private store: Store<StoreState>,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    // public jwtHelper: JwtHelperService
  ) { 
    // console.log('123123');
  }

  ngOnInit() {
    // console.log('who is first app compoent');
    this.auth$ = this.store.select('auth');

    // using angular-jwt to get expired date
    // console.log(this.jwtHelper.getTokenExpirationDate() );
    // if(this.jwtHelper.getTokenExpirationDate() < new Date()){
    //   localStorage.removeItem("orcasmart_access_token");  
    //   location.href="/auth/login";  
    // }

    if (this.authService.getOrcaToken()) {
      this.isLoading = true;
      this.authService.getCurrentUser().subscribe(
        data => {
          this.store.dispatch(new AuthActions.SetCurrentUser(data.user));
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
        }
      );
    }else{
      // console.log('app component');
      // console.log('no token');
      this.isLoading = false;
      if(document.URL.includes('auth')){
        // console.log('app component');
      }else if(document.URL.includes('confirm')){
        // this.router.navigateByUrl('/confirm/salesentity');
      }else{
        // console.log('appcomponet');
        this.router.navigateByUrl('/auth/login');
      }
      
    }
  }

}
