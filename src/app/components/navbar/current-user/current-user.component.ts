import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { User } from 'app/core/models';
import * as fromAuthReduer from 'app/core/reducers/auth.reducer';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';
import { Store } from '@ngrx/store';
import { StoreState } from 'app/core/models/store-state';
import { AuthService } from 'app/core/services/auth.service';
import * as AuthActions from 'app/core/actions/auth.action';
import { ToasterService } from 'app/core/services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'current-user',
  templateUrl: 'current-user.component.html',
  styleUrls: ['current-user.component.scss']
})

export class CurrentUserComponent implements OnInit {
  @Input() auth: fromAuthReduer.State;
  @Input() sidenav;

  constructor(
    private authService: AuthService,
    private store: Store<StoreState>,
    private toasterService: ToasterService,
    private router: Router
  ) {
  }

  ngOnInit() {

  }

  onClick() {
    this.router.navigate(['/setting/profile']);
    this.sidenav.close();
  }

  logout() {
    this.authService.removeOrcaToken();
    this.store.dispatch(new AuthActions.LogoutSuccess());
    this.toasterService.showToaster('logged out!', 'ok', 3000);
  }

  onClickProfilePicture() {
    this.sidenav.close();
  }

}
