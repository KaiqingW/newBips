import { Component, OnInit } from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'opportunity-person-project-discussion',
  templateUrl: './opportunity-person-project-discussion.component.html',
  styleUrls: ['./opportunity-person-project-discussion.component.scss']
})
export class OpportunityPersonProjectDiscussionComponent implements OnInit {

  currentLoginCompanyId;
  projectDiscussion;
  project_id;
  isLoading;

  constructor(
    private businessMeetingService : BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    this.project_id = this.route.snapshot.paramMap.get('oppoProjectId');
    this.isLoading = true;   
   }

  ngOnInit() {
    this.getProjectDiscussion();
  }

  getProjectDiscussion() {
    this.businessMeetingService.getProjectDiscussion(this.currentLoginCompanyId, this.project_id).subscribe(
      res => {
        this.projectDiscussion = res;
        this.isLoading = false;
      }
    );

    // delete the unread record of the comment of the project discussion
    this.deleteUnreadComment();
  }

  deleteUnreadComment() {
    this.businessMeetingService.deleteUnreadComment(this.currentLoginCompanyId, this.project_id).subscribe(
      res => {}
    )
  }

}
