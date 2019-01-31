import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { BusinessMeetingService } from 'app/core/services/business-meeting.service';

@Component({
  selector: 'shared-subject-list',
  templateUrl: './shared-subject-list.component.html',
  styleUrls: ['./shared-subject-list.component.scss']
})
export class SharedSubjectListComponent implements OnInit, AfterViewChecked {

  currentLoginCompanyId;

  sharedSubjectList;
  sharedSubjectList2;
  isLoading;
  isDataLoading;

  subjectListUnread;
  sharedSubjectListUnread;

  //store next url to fetch more subjects
  next: '';

  //count mouse wheel
  countMouseWheel = 0;

  // set naximum refresh height
  refreshHeight = 400;

  // max num of share
  maxAdmin: number = 7;
  maxShare = [];

  constructor(
    private businessMeetingService: BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    this.isLoading = true;
  }

  ngOnInit() {
    this.getSharedSubjectList();
    this.getSubjectListUnread();
    this.getSharedSubjectListUnread();
  }

  // step forth, import AfterViewChecked, and implements AfterViewChecked
  // at ngAfterViewChecked() function, call backToLocation() function 
  // so that when you go back to the page, it will jump to the location that you scrolled previous automatically, editted by yali
  ngAfterViewChecked() {
    this.backToLocation();
    
  }

  getSharedSubjectList() {

    this.businessMeetingService.getSharedSubjectList(this.currentLoginCompanyId).subscribe(
      res => {
        this.sharedSubjectList = res.data.data;
        this.isLoading = false;
        this.next = res.paging.next;
        this.isDataLoading = false;

        for (let i = 0; i < this.sharedSubjectList.length; i++) {
          this.maxShare[i] = (this.maxAdmin - this.sharedSubjectList[i].sharedWithAdmin.length > 0) ? this.maxAdmin - this.sharedSubjectList[i].sharedWithAdmin.length : 0;
        }
      }
    )
  }

  // get the total unread records of the subject  lists
  getSubjectListUnread() {
    this.businessMeetingService.getSubjectListUnread(this.currentLoginCompanyId).subscribe(
      res => {
        this.subjectListUnread = res;
      }
    )
  }

  // get the total unread records of shared subject lists
  getSharedSubjectListUnread() {
    this.businessMeetingService.getSharedSubjectListUnread(this.currentLoginCompanyId).subscribe(
      res => {
        this.sharedSubjectListUnread = res;
      }
    )
  }

  //scroll to get more leads
  public onMouseWheel(evt) {

    // first step, write scroll_position to the local storage, editted by yali
    localStorage.setItem('scroll_position', evt.target.scrollTop);

    // if(evt.deltaY > 0){
    //     this.countMouseWheel = this.countMouseWheel + evt.deltaY;
    // }
    // if(this.countMouseWheel > this.refreshHeight){
    //     //get my next page of leads
    //     if(this.next !=null)
    //     this.isDataLoading = true;
    //     this.refreshHeight = this.refreshHeight + 900;
    //     this.businessMeetingService.getSharedSubjectListnext(this.next).subscribe(
    //         res =>{
    //             this.sharedSubjectList2 = res.data.data;
    //             for (var i = 0; i< this.sharedSubjectList2.length; i++){
    //                 this.sharedSubjectList.push(this.sharedSubjectList2[i]);
    //             }
    //             this.next = res.paging.next;
    //             this.isDataLoading = false;
    //         },err =>{
    //             this.isLoading = false;
    //         }
    //     )
    // }
    if (evt.target.scrollTop > this.refreshHeight) {
      //get my next page of leads
      if (this.next != null)
        this.isDataLoading = true;
      this.refreshHeight = this.refreshHeight + 900;
      this.businessMeetingService.getSharedSubjectListnext(this.next).subscribe(
        res => {
          this.sharedSubjectList2 = res.data.data;
          for (var i = 0; i < this.sharedSubjectList2.length; i++) {
            this.sharedSubjectList.push(this.sharedSubjectList2[i]);
          }
          this.next = res.paging.next;
          this.isDataLoading = false;
        }, err => {
          this.isLoading = false;
        }
      )
    }
  }
 
  markSharedSubject(subjectId, mark) {
    let request;
    
    if (mark == 0) {
      request = {
        "shared_mark" : 1
      };
    } else if (mark == 1) {
      request = {
        "shared_mark" : 2
      };
    }
       
    this.isDataLoading = true;
    this.businessMeetingService.markSharedSubject(this.currentLoginCompanyId, subjectId, request).subscribe(
      res => {
        this.getSharedSubjectList();
      }
    );
  }

  cancelSharedMarkSubject(subjectId) {
    let request = {
      "shared_mark": 0
    };

    this.isDataLoading = true;
    this.businessMeetingService.markSharedSubject(this.currentLoginCompanyId, subjectId, request).subscribe(
      res => {
        this.getSharedSubjectList();
      }
    );
  }

  // thrid step, get scroll_position from the local storage, and jump to the location
  backToLocation() {
    
    // second step, add id="content" at html at the location where the onMouseWheel function is called, editted by yali
    let content = document.getElementById('content');

    let scroll_position = +localStorage.getItem("scroll_position");
    
    if (content) {
      content.scrollTo({ top: scroll_position, left: 0, behavior: 'auto' });
    }
  }

}
