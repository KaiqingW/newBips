import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ShowMorePipe } from '../../show-more.pipe';

import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';

@Component({
  selector: 'opportunity-list',
  templateUrl: './opportunity-list.component.html',
  styleUrls: ['./opportunity-list.component.scss']
})
export class OpportunityListComponent implements OnInit {

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
  
  constructor(
    private businessMeetingService : BusinessMeetingService,
    private departmentOpportunityService: DepartmentOpportunityService,
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

  getSubjectList() {
    let active = 1;
    this.departmentOpportunityService.getSubjectList(this.currentLoginCompanyId, active).subscribe (
      res => {
        this.subjectList$ = res.data;
        this.isLoading = false;
        this.next = res.paging.next;
        this.isDataLoading = false;

        for (let i=0; i<this.subjectList$.length; i++) {
          this.maxShare[i] = (this.maxAdmin - this.subjectList$[i].sharedWithAdmin.length > 0) ? this.maxAdmin - this.subjectList$[i].sharedWithAdmin.length : 0;
        }
      }
    )
  }

  // get the total unread records of the subject  lists
  getSubjectListUnread() {
    this.departmentOpportunityService.getSubjectListUnread(this.currentLoginCompanyId).subscribe(
      res => {
        this.subjectListUnread = res;
      }
    )
  }

  // get the total unread records of shared subject lists
  getSharedSubjectListUnread() {
    this.departmentOpportunityService.getSharedSubjectListUnread(this.currentLoginCompanyId).subscribe(
      res => {
        this.sharedSubjectListUnread = res;
      }
    )
  }

  //scroll to get more leads
  public onMouseWheel(evt) {
    if(evt.deltaY > 0){
        this.countMouseWheel = this.countMouseWheel + evt.deltaY;
    }
    if(this.countMouseWheel > this.refreshHeight){
        //get my next page of leads
        if(this.next !=null)
        this.isDataLoading = true;
        this.refreshHeight = this.refreshHeight + 900;
        this.departmentOpportunityService.getSubjectListnext(this.next).subscribe(
            res =>{
                this.subjectList2 = res.data;
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

  markSubject(subjectId) {
    let request = {
      "mark" : 1
    };

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

}
