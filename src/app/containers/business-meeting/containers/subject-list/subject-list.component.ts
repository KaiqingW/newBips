import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd  } from '@angular/router';
import { ShowMorePipe } from '../../show-more.pipe';

import { BusinessMeetingService } from 'app/core/services/business-meeting.service';

@Component({
  selector: 'subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss']
})
export class SubjectListComponent implements OnInit, AfterViewChecked {

  currentLoginCompanyId;
  subjectList$;
  subjectList2;
  isLoading;
  isDataLoading;

  subjectListUnread;
  sharedSubjectListUnread;
  
  //store next url to fetch more subjects
  next:'';
  
  //count mouse wheel
  countMouseWheel = 0;

  // set naximum refresh height
  refreshHeight = 400;

  // max num of share
  maxAdmin: number = 7;
  maxShare = [];

  // max num of owners of porject
  maxOwner: number = 3;

  // used for open subject by arrow
  openSubject;
  selectedSubject;

  constructor(
    private businessMeetingService : BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
    
  ) { 
    this.isLoading = true;
    
    //get company id form route
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');

  }

  ngOnInit() {
    this.getSubjectList();
    this.getSubjectListUnread();
    this.getSharedSubjectListUnread();

  }

  // step forth, import AfterViewChecked, and implements AfterViewChecked
  // at ngAfterViewChecked() function, call backToLocation() function 
  // so that when you go back to the page, it will jump to the location that you scrolled previous automatically, editted by yali
  ngAfterViewChecked() {
    this.backToLocation();
    
  }

  getSubjectList() {
    let active = 1;
    this.businessMeetingService.getSubjectList(this.currentLoginCompanyId, active).subscribe (
      res => {
        this.subjectList$ = res.data;

        this.getTotalUnreadofNextMeeting(this.subjectList$);

        this.isLoading = false;
        this.next = res.paging.next;
        this.isDataLoading = false;

        for (let i=0; i<this.subjectList$.length; i++) {
          this.maxShare[i] = (this.maxAdmin - this.subjectList$[i].sharedWithAdmin.length > 0) ? this.maxAdmin - this.subjectList$[i].sharedWithAdmin.length : 0;
        }
        
      }
    )
  }

  getTotalUnreadofNextMeeting(subjectList) {
    
      let total_next_meeting_subjects_unread = 0;

      let i;
      let j;
      let k;
      // calculate the sum of unread of the total next meeting subjects of the project
      for (i=0; i<subjectList.length; i++) {
        for (j=0; j<subjectList[i].projects.length; j++) {
          // add new property to project
          subjectList[i].projects[j].total_next_meeting_subjects_unread = 0;
          
          for (k=0; k<subjectList[i].projects[j].next_meeting_subjects.length; k++) {

            // calculate total_next_meeting_subjects_unread
            total_next_meeting_subjects_unread += subjectList[i].projects[j].next_meeting_subjects[k].unread_count;
          }
          // give value to total_next_meeting_subjects_unread of the project
          subjectList[i].projects[j].total_next_meeting_subjects_unread = total_next_meeting_subjects_unread;
          // reset total_next_meeting_subjects_unread to be 0
          total_next_meeting_subjects_unread = 0;
        }
      }

  }

  // get the total unread records of the subject lists
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

  open(event, subject) {
    // event.stopPropagation();
    if (this.openSubject == subject) {
      this.openSubject = '';
    } else {
      this.openSubject = subject;
    }
  }

  isExpand(subject) {
    return this.openSubject == subject;
  }

  selectSubject(subject) {
    this.selectedSubject = subject;
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
    //     this.businessMeetingService.getSubjectListnext(this.next).subscribe(
    //         res =>{
    //             this.subjectList2 = res.data;
    //             for (var i = 0; i< this.subjectList2.length; i++){
    //                 this.subjectList$.push(this.subjectList2[i]);
    //             }
    //             this.next = res.paging.next;
    //             this.isDataLoading = false;
    //         },err =>{
    //             this.isLoading = false;
    //         }
    //     )
    // }
    if(evt.target.scrollTop > this.refreshHeight){

      //get my next page of leads
      if(this.next !=null)
      this.isDataLoading = true;
      this.refreshHeight = this.refreshHeight + 900;
      this.businessMeetingService.getSubjectListnext(this.next).subscribe(
          res =>{
              this.subjectList2 = res.data;
              this.getTotalUnreadofNextMeeting(this.subjectList2);

              for (var i = 0; i< this.subjectList2.length; i++){
                  this.subjectList$.push(this.subjectList2[i]);
              }
              this.next = res.paging.next;
              this.isDataLoading = false;
          },err =>{
              this.isLoading = false;
          }
      )
  }
  }

  markSubject(subjectId, mark) {
    let request;

    if (mark == 0) {
      request = {
        "mark" : 1
      };
    } else if (mark == 1) {
      request = {
        "mark" : 2
      };
    }
   

    this.isDataLoading = true;
    this.businessMeetingService.markSubject(this.currentLoginCompanyId, subjectId, request).subscribe(
      res => {
        this.getSubjectList();
      }
    );
  }

  cancelMarkSubject(subjectId) {
    let request = {
      "mark" : 0
    };

    this.isDataLoading = true;
    this.businessMeetingService.markSubject(this.currentLoginCompanyId, subjectId, request).subscribe(
      res => {
        this.getSubjectList();
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
