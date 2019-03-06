import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { StoreState } from 'app/core/models';
import { Router } from '@angular/router';
import * as AuthActions from 'app/core/actions/auth.action';
import * as fromAuthReducer from 'app/core/reducers/auth.reducer';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})

export class HomeComponent implements OnInit {

  auth$: Observable<fromAuthReducer.State>;
  isLoading = false;
  currentWholeUrl;
  constructor(
    private store: Store<StoreState>,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('home component');
    this.currentWholeUrl = document.URL;
    //if can't get token from localstorage and the url contain 'confirm';
    if(!localStorage.getItem("orcasmart_access_token")&& this.currentWholeUrl.toLowerCase().includes('confirm')){
      // this.router.navigate(['confirm/salesentity']);
    }else if(!localStorage.getItem("orcasmart_access_token")){
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit() {
    this.auth$ = this.store.select('auth');
    // console.log(this.auth$);
  }
}
