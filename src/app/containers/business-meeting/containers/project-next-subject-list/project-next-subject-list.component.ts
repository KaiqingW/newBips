import { Component, OnInit } from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'project-next-subject-list',
  templateUrl: './project-next-subject-list.component.html',
  styleUrls: ['./project-next-subject-list.component.scss']
})
export class ProjectNextSubjectListComponent implements OnInit {

  project;
  projectId;
  currentLoginCompanyId;
  isLoading;

  currUser_id;
  
  // ownerPermission is the permission of the owner of the project, because only owner can generate new meeting
  ownerPermission: boolean = false;

  // max num of share
  maxAdmin: number = 7;
  maxShare = [];

  constructor(
    private businessMeetingService: BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
    private authService : AuthService,    
    
  ) { 
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.isLoading = true;
    
  }

  ngOnInit() {
    this.getProjextNextSubjectList();
  }

  getProjextNextSubjectList() {
    this.businessMeetingService.getProjectWithNextSubjectList(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {
        this.project = res;
        this.isLoading = false;

        for (let i=0; i<this.project.next_meeting_subjects.length; i++) {
          this.maxShare[i] = (this.maxAdmin - this.project.next_meeting_subjects[i].sharedWithAdmin.length > 0) ? this.maxAdmin - this.project.next_meeting_subjects[i].sharedWithAdmin.length : 0;
        }

        // get the current logined user, check whether the user is the owner of the project
        // only the owner of the project can generate next meeting
        // if so, ownerPermission = true;
        this.authService.getCurrentUserBrief().subscribe(
          res => {
            // currUser_id is the user's id in orcasmaer database
            this.currUser_id = res.user.id;

            // check whether the current user is owner of the project, if so, they can generate neew meeting
            let owners = this.project.owners;
            for (let i=0; i<owners.length; i++) {
              if (owners[i].user_id == this.currUser_id) {
                this.ownerPermission = true;
              }
            }
          }
        );       
        
      }
    )
  }

}
