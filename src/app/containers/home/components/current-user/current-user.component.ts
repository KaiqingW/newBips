import { Component, Input, OnInit } from '@angular/core';
import { User } from 'app/core/models';
import * as fromAuthReducer from 'app/core/reducers/auth.reducer';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';
import { Store } from '@ngrx/store';
import { StoreState } from 'app/core/models/store-state';
import { AuthService } from 'app/core/services/auth.service';
import * as AuthActions from 'app/core/actions/auth.action';

@Component({
  selector: 'current-user',
  templateUrl: 'current-user.component.html',
  styleUrls: ['current-user.component.scss']
})

export class CurrentUserComponent implements OnInit {
  @Input() auth: fromAuthReducer.State;

  constructor(private authService: AuthService,
    private store: Store<StoreState>) {
  }

  ngOnInit() {

  }

}
