import { Component, OnInit } from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'project-discussion',
  templateUrl: './project-discussion.component.html',
  styleUrls: ['./project-discussion.component.scss']
})
export class ProjectDiscussionComponent implements OnInit {

  currentLoginCompanyId;
  projectDiscussion;
  project_id;
  isLoading;
  subject_id;

  commentType="project";
  

  constructor(
    private businessMeetingService : BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    this.project_id = this.route.snapshot.paramMap.get('projectId');
    this.subject_id = this.route.snapshot.paramMap.get('subjectId');
    
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

  addProjectComment() {
    this.router.navigate([`/company/${this.currentLoginCompanyId}/business-meeting/subject/${this.subject_id}/project/${this.project_id}/discussion/add-comment`,{commentType: this.commentType}])
  }
}
