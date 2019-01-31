import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { StoreState } from 'app/core/models';
import * as fromAuthReducer from 'app/core/reducers/auth.reducer';
import { LoggingUserService } from 'app/core/services/logging-user.service';

@Component({
  selector: 'meeting',
  templateUrl: 'meeting.component.html',
  styleUrls: ['meeting.component.scss']
})

export class MeetingComponent implements OnInit {

  auth$: Observable<fromAuthReducer.State>;

    constructor(
      private store: Store<StoreState>,
      private loggingUserService: LoggingUserService
    ) {

    }

    ngOnInit() {
      this.auth$ = this.store.select('auth');
      this.auth$.subscribe(res => {
        if (res.currentUser) {
          this.loggingUserService.user = res.currentUser;
        }
      });
    }

}
