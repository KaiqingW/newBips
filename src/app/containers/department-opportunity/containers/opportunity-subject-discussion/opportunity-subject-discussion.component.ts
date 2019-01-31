import { Component, OnInit } from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'opportunity-subject-discussion',
  templateUrl: './opportunity-subject-discussion.component.html',
  styleUrls: ['./opportunity-subject-discussion.component.scss']
})
export class OpportunitySubjectDiscussionComponent implements OnInit {

  currentLoginCompanyId;
  briefSubject;
  subject_id;
  isLoading;

  constructor(
    private businessMeetingService : BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    this.subject_id = this.route.snapshot.paramMap.get('oppoSubjectId');
    this.isLoading = true;    
  }

  ngOnInit() {
    this.getBriefSubject();    
  }

  getBriefSubject() {
    this.businessMeetingService.getBriefSubject(this.currentLoginCompanyId, this.subject_id).subscribe(
      res => {
        this.briefSubject = res;
        this.isLoading = false;

        // delete the unread comment (status) of the discussion (project)
        this.deleteUnreadComment();
      }
    )
  }

  deleteUnreadComment() {
    this.businessMeetingService.deleteUnreadComment(this.currentLoginCompanyId, this.briefSubject.discussion.id).subscribe(
      res => {}
    )
  }

}
