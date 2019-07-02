import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import * as fromAuthReducer from 'app/core/reducers/auth.reducer';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { Header } from 'app/core/models/header';
import { Location } from '@angular/common';
import { CommonService } from 'app/core/services/common.service';
import { CartService } from 'app/core/services/cart.service';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss'],
  providers: [CartService],
})

export class NavbarComponent implements OnInit {
  @Input() auth: fromAuthReducer.State;
  needSearching: boolean = false;
  headerData: Header;
  term;
  companyId;
  subjectId;
  subjectIdFlag: boolean = false;
  sharedSubjectId;
  sharedSubjectIdFlag: boolean = false;
  headerUrl;
  cartNum;
  // if it is personal meetig, true; else false
  personalMeetingFlag: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private commonService: CommonService,
    private cartService: CartService,) {

    // if (this.isDesktop()) {
    //   let width = '50%';

    // }
  }

  ngOnInit() {
    
    const routeData = this.router.events.subscribe((data) => {
      // console.log("good");
      this.companyId = +localStorage.getItem("currentLoginCompanyId");
      // console.log(this.companyId);
      // console.log("header");
      // console.log(document.URL);

      if (data instanceof RoutesRecognized) {
        let fc;
        for (fc = data.state.root; fc.firstChild; fc = fc.firstChild) {
        }
        this.headerUrl = fc.url;

        if (this.headerUrl.length == 4 && this.headerUrl[0].path == 'subject' || this.headerUrl.length == 2 && this.headerUrl[0].path == 'subject') {
          this.subjectId = +this.headerUrl[1].path;
          this.subjectIdFlag = true;
          // console.log(this.subjectId);
        }

        if (this.headerUrl.length == 4 && this.headerUrl[0].path == 'subject_shared' || this.headerUrl.length == 2 && this.headerUrl[0].path == 'subject_shared') {
          this.sharedSubjectId = +this.headerUrl[1].path;
          // console.log(this.sharedSubjectId);
          this.sharedSubjectIdFlag = true;
        }

        // define a new headerData object, since fc.data is read-only
        this.headerData = {
          title: fc.data.title,
          isEditingPage: fc.data.isEditingPage,
          isBack: fc.data.isBack,
          dashboard: fc.data.dashboard,
          isHome: fc.data.isHome,
          nextUrl: fc.data.nextUrl,
          needSearching: fc.data.needSearching,
          needCart: fc.data.needCart,
          showHeader: fc.data.showHeader
        };


        // redefind nextUrl for meeting, according to the title of headerData
        if (this.headerData.title == 'Meeting List' && this.companyId != 0) {
          this.headerData.nextUrl = 'dashboard';
        } else if (this.headerData.title == 'Meeting List' && this.companyId == 0) {
          this.headerData.nextUrl = 'home';
        } else if (this.subjectIdFlag && this.headerData.title == 'Meeting Subject') {
          if (this.companyId > 0) {
            this.headerData.nextUrl = `/company/${this.companyId}/company-meeting/meeting/subject`;
          } else if (this.companyId == 0) {
            this.headerData.nextUrl = `/personal-meeting/meeting/subject`;
          }
          this.subjectIdFlag = false;
        } else if (this.subjectIdFlag && this.headerData.title == 'Meeting Project') {
          if (this.companyId > 0) {
            this.headerData.nextUrl = `/company/${this.companyId}/company-meeting/meeting/subject/${this.subjectId}`;
          } else if (this.companyId == 0) {
            this.headerData.nextUrl = `/personal-meeting/meeting/subject/${this.subjectId}`;
          }
          this.subjectIdFlag = false;
        } else if (this.sharedSubjectIdFlag && this.headerData.title == 'Meeting Subject') {
          if (this.companyId > 0) {
            this.headerData.nextUrl = `/company/${this.companyId}/company-meeting/meeting/subject_shared`;
          } else if (this.companyId == 0) {
            this.headerData.nextUrl = `/personal-meeting/meeting/subject_shared`;
          }
          this.sharedSubjectIdFlag = false;
        } else if (this.sharedSubjectIdFlag && this.headerData.title == 'Meeting Project') {
          if (this.companyId > 0) {
            this.headerData.nextUrl = `/company/${this.companyId}/company-meeting/meeting/subject_shared/${this.sharedSubjectId}`;
          } else if (this.companyId == 0) {
            this.headerData.nextUrl = `/personal-meeting/meeting/subject_shared/${this.sharedSubjectId}`;
          }
          this.sharedSubjectIdFlag = false;
        } else if (this.subjectIdFlag && this.headerData.title == 'Subject') {
          this.headerData.nextUrl = `/notes/subject`;
          this.subjectIdFlag = false;
        } else if (this.sharedSubjectIdFlag && this.headerData.title == 'Subject') {
          this.headerData.nextUrl = `/notes/subject_shared`;
          this.sharedSubjectIdFlag = false;
        } else if (this.subjectIdFlag && this.headerData.title == 'Subject Note') {
          this.headerData.nextUrl = `/notes/subject/${this.subjectId}`;
          this.sharedSubjectIdFlag = false;
        } else if (this.sharedSubjectIdFlag && this.headerData.title == 'Subject Note') {
          this.headerData.nextUrl = `/notes/subject_shared/${this.sharedSubjectId}`;
          this.sharedSubjectIdFlag = false;
        } else if (this.headerData.title == 'Subject List' && this.companyId != 0) {
          this.headerData.nextUrl = 'dashboard';
        } else if (this.headerData.title == 'Subject List' && this.companyId == 0) {
          this.headerData.nextUrl = 'home';
        }
      }
    });


  }

  isDesktop() {
    var regex_match = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;
    var u = navigator.userAgent;
    if (null == u) {
      return true;
    }
    var result = regex_match.exec(u);

    if (null == result) {
      return true;
    } else {
      return false;
    }
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

  onHome() {
    this.needSearching = false;
    if (this.headerData.isHome) {
      this.router.navigateByUrl('home');
    } else {
      this.location.back();
    }
  }

  toSearch() {
    this.needSearching = true;
  }

  onSearch(value) {
    // this.commonService.sendMessage(value);
    this.commonService.searhTerm.next(value);
  }

}
