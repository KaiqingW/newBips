import { Component, OnInit } from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'more-shared-user-list',
  templateUrl: './more-shared-user-list.component.html',
  styleUrls: ['./more-shared-user-list.component.scss']
})
export class MoreSharedUserListComponent implements OnInit {

  currentLoginCompanyId;
  subject;
  subject_id;
  isLoading;
  
  constructor(
    private businessMeetingService : BusinessMeetingService,
    private route: ActivatedRoute,
  ) { 
    this.isLoading = true;
    
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    this.subject_id = this.route.snapshot.paramMap.get('subjectId');
  }

  ngOnInit() {
    this.getSubjectWithSharedUserList();
  }

  getSubjectWithSharedUserList() {
    this.businessMeetingService.getSubjectWithSharedUserList(this.currentLoginCompanyId, this.subject_id).subscribe(
      res => {
        this.subject = res;
        this.isLoading = false;

      }
    )
  }

}
