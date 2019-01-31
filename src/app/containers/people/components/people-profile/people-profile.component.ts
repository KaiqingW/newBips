import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'app/core/services/user.service';
import { LoggingUserService } from 'app/core/services/logging-user.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { StoreState } from 'app/core/models';
import * as fromAuthReducer from 'app/core/reducers/auth.reducer';

@Component({
  selector: 'app-people-profile',
  templateUrl: './people-profile.component.html',
  styleUrls: ['./people-profile.component.scss']
})
export class PeopleProfileComponent implements OnInit {

  userId;

  user;

  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private userService: UserService,
    private store: Store<StoreState>,
    private loggingUserService: LoggingUserService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.initialiseState();
    });

  }

  initialiseState() {
    this.isLoading = true;
    this.userId = +this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.initialiseStateHelper();
    } else {
      this.store.select('auth').subscribe(res => {
        if (res.currentUser) {
          this.userId = res.currentUser.id;
          this.initialiseStateHelper();
        }
      });
    }
  }

  initialiseStateHelper() {
    this.userService.getUserProfile(this.userId).subscribe(res => {
      this.user = res;
      // console.log(this.user);
      this.isLoading = false;
    }, err => {
      console.log(err); this.isLoading = false;
    });
  }

}
