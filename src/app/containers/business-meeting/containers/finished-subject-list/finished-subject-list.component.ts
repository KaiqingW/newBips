import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { BusinessMeetingService } from 'app/core/services/business-meeting.service';

@Component({
  selector: 'finished-subject-list',
  templateUrl: './finished-subject-list.component.html',
  styleUrls: ['./finished-subject-list.component.scss']
})
export class FinishedSubjectListComponent implements OnInit {

  currentLoginCompanyId;

  subjectList;
  subjectList2;
  isLoading;
  isDataLoading;

  //store next url to fetch more subjects
  next:'';
  
  //count mouse wheel
  countMouseWheel = 0;

  // set naximum refresh height
  refreshHeight = 400;

  selects = ['My Finished Meeting', 'Shared Finished Meeting', 'My Trashed Meeting'];
  placeholder = "My Finished Meeting";
  default = "My Finished Meeting";

  // max num of share
  maxAdmin: number = 7;
  maxShare = [];

  constructor(
    private businessMeetingService : BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    this.isLoading = true;
  }

  ngOnInit() {
    this.getFinishedSubjectList();
  }

  getFinishedSubjectList() {
    let active = 0;
    this.businessMeetingService.getSubjectList(this.currentLoginCompanyId, active).subscribe(
      res => {
        this.subjectList = res.data;
        this.isLoading = false;
        this.isDataLoading = false;
        this.next = res.paging.next;
        
        for (let i=0; i<this.subjectList.length; i++) {
          this.maxShare[i] = (this.maxAdmin - this.subjectList[i].sharedWithAdmin.length > 0) ? this.maxAdmin - this.subjectList[i].sharedWithAdmin.length : 0;
        }
      }
    )
  }

  getFinishedSharedSubjectList() {
    this.businessMeetingService.getFinishedSharedSubjectList(this.currentLoginCompanyId).subscribe(
      res => {
        this.subjectList = res.data;
        this.isLoading = false;
        this.isDataLoading = false;
        this.next = res.paging.next;
        
        for (let i=0; i<this.subjectList.length; i++) {
          this.maxShare[i] = (this.maxAdmin - this.subjectList[i].sharedWithAdmin.length > 0) ? this.maxAdmin - this.subjectList[i].sharedWithAdmin.length : 0;
        }
        
      }
    )
  }

  getTrashedSubjectList() {
    this.businessMeetingService.getTrashedSubjectList(this.currentLoginCompanyId).subscribe(
      res => {
        this.subjectList = res.data;
        this.isLoading = false;
        this.isDataLoading = false;
        this.next = res.paging.next;
        
        for (let i=0; i<this.subjectList.length; i++) {
          this.maxShare[i] = (this.maxAdmin - this.subjectList[i].sharedWithAdmin.length > 0) ? this.maxAdmin - this.subjectList[i].sharedWithAdmin.length : 0;
        }
      }
    )
  }

  onGetSelect(value) {

    // my finished meeting
    if (value.status == this.selects[0]) {
      this.isLoading = true;
      this.getFinishedSubjectList();
      // shared finished meeting
    } else if (value.status == this.selects[1]) {
      this.isLoading = true;
      this.getFinishedSharedSubjectList();
     // my trashed meeting
    }else if (value.status == this.selects[2]) {
      this.isLoading = true;
      this.getTrashedSubjectList();
    }
  }

  //scroll to get more leads
  public onMouseWheel(evt) {
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
    //                 this.subjectList.push(this.subjectList2[i]);
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
              for (var i = 0; i< this.subjectList2.length; i++){
                  this.subjectList.push(this.subjectList2[i]);
              }
              this.next = res.paging.next;
              this.isDataLoading = false;
          },err =>{
              this.isLoading = false;
          }
      )
  }
  }
}
