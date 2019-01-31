import { Component, OnInit } from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'more-project-owner-list',
  templateUrl: './more-project-owner-list.component.html',
  styleUrls: ['./more-project-owner-list.component.scss']
})
export class MoreProjectOwnerListComponent implements OnInit {

  project;
  projectId;
  currentLoginCompanyId;
  isLoading;

  constructor(
    private businessMeetingService: BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.isLoading = true;
   }

  ngOnInit() {
    this.getBriefProject();
  }

  getBriefProject() {
    this.businessMeetingService.getBriefProject(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {
        this.project = res;
        console.log(this.project);
      }
    )
  }

}
