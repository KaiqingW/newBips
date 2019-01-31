import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { StoreState, User } from 'app/core/models';
import { Router } from '@angular/router';
import * as fromAuthReducer from 'app/core/reducers/auth.reducer';

@Component({
    selector: 'auth',
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.component.scss']
})

export class AuthComponent implements OnInit {
    auth$: Observable<fromAuthReducer.State>;
    
    constructor(
        private store: Store<StoreState>,
        private router: Router
    ) { }

    ngOnInit(){
        this.auth$ = this.store.select('auth');
        this.auth$.subscribe(
            (auth: fromAuthReducer.State) => {
                if(auth.orcaAuthenticated){
                    this.router.navigate(['/home']);
                }
            }
        )
    }
    
}