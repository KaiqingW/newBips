import { Component, Input, OnChanges, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as fromAuthReducer from 'app/core/reducers/auth.reducer';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { Header } from 'app/core/models/header';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { StoreState } from 'app/core/models/store-state';
import { AuthService } from 'app/core/services/auth.service';
import * as AuthActions from 'app/core/actions/auth.action';
import { ToasterService } from 'app/core/services/toaster.service';
import { CommonService } from 'app/core/services/common.service';
import { DialogService } from 'app/core/services/dialog.service';
import { CompanyService } from 'app/core/services/company.service';

import { MeetingService } from 'app/core/services/meeting.service';
import { UMeditorComponent } from 'ngx-umeditor';

@Component({
  selector: 'business-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})

export class BusinessDashboardComponent implements OnInit {
  needSearching: boolean = false;
  headerData: Header;
  term;
  unreadMySubjectNumber: number = 0;
  unreadSharedWithMeNumber: number = 0;
  mySubjectList;
  unreadList;
  companyId = 0;
  unreadSubject: number;
  isLoading: boolean;
  vbCompanyId = 126;
  currentUser;
  companyEmployeeList;
  // id the ppi company at orcasmart.us, just use this temp, editted by yali
  ppiCompanyId = 237;
  // check whether the current user is the employee of the ppi company
  // if so, the user can see the vendor
  // else, the user cannot see the vendor
  isPPIEmployee: boolean = false;
  if_web;

  @ViewChild('full') full: UMeditorComponent;


    getAllHtml() {
        // 通过 `this.full.Instance` 访问umeditor实例对象
        alert(this.full.Instance.getAllHtml())
    }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private commonService: CommonService,
    private authService: AuthService,
    private store: Store<StoreState>,
    private toasterService: ToasterService,
    private dialogService: DialogService,
    private meetingService: MeetingService,
    private companyService: CompanyService,
    private el: ElementRef

  ) {
    this.isLoading = true;
    this.getCurrentUser();
    this.is_mobile();
    console.log(document.URL);
    // if(document.URL.includes('w-index')){
    //   this.if_web = true;
    // } else {
    //   this.if_web = false;
    // }

    if (this.is_mobile()) {
      this.if_web = false;
      console.log("document.URL.false");
      // document.location.href= 'http://www.orcasmart.co';
    } else {
      this.if_web = true;
      console.log("document.URL.true");
      // document.location.href= 'http://orcasmart.shop/w-index.html';
    }

  }

  ngOnInit() {
    const routeData = this.router.events.subscribe((data) => {
      if (data instanceof RoutesRecognized) {
        let fc;
        for (fc = data.state.root; fc.firstChild; fc = fc.firstChild) {
        }
        this.headerData = fc.data;
      }
    });
    this.getmeetingRecord();
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(
      res => {
        this.currentUser = res.user;
        // this.vbCompanyId = res.user;

        // get current employee list of 237, editted by yali
        this.companyService.getCompany(this.ppiCompanyId).subscribe(
          res => {
            this.companyEmployeeList = res.employees;

            for (let i = 0; i < this.companyEmployeeList.length; i++) {
              if (this.currentUser.id == this.companyEmployeeList[i].id) {
                this.isPPIEmployee = true;
                break;
              }
            }
          })
      }
    )
  }

  onCancel() {
    this.needSearching = false;
    if (this.headerData.nextUrl) {
      this.router.navigateByUrl(this.headerData.nextUrl);
    } else {
      this.location.back();
    }
  }

  onDashboard() {
    this.needSearching = false;
    if (this.headerData.dashboard) {
      this.router.navigateByUrl('dashboard');
    } else {
      this.location.back();
    }
  }

  logout() {
    this.dialogService.openSureDialog().subscribe(result => {
      if (result) {
        this.authService.removeOrcaToken();
        this.store.dispatch(new AuthActions.LogoutSuccess());
        this.router.navigateByUrl('auth/login');
        this.toasterService.showToaster('logged out!', 'ok', 3000);
        this.resetPurchaseOrderLocalStorage();
      }
    })
  }

  // cannot be used here
  // when go back to home, do not remove currentLoginCompanyId at local storage, 
  // when go back the home page, automatically log out the company
  logoutCompany() {
    // localStorage.removeItem('currentLoginCompanyId');
  }

  resetPurchaseOrderLocalStorage() {
    localStorage.removeItem('order');
    localStorage.removeItem('user_pre_view_container');
    localStorage.removeItem('scroll_position');
  }

  toSearch() {
    this.needSearching = true;
  }

  onSearch(value) {
    // this.commonService.sendMessage(value);
    this.commonService.searhTerm.next(value);
  }


  // get my subject list and shared user list first
  getmeetingRecord() {
    this.meetingService.getSubjectList('company_id', this.companyId).subscribe(
      res => {
        this.unreadSubject = res.unread.length;
        this.isLoading = false;

      })
  }

  is_mobile() {
    var regex_match = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;
    var u = navigator.userAgent;
    if (null == u) {
      return true;
    }
    var result = regex_match.exec(u);

    if (null == result) {
      return false
    } else {
      return true
    }
  }

}

