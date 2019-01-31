import { Component, OnInit } from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';
import { DialogService } from 'app/core/services/dialog.service';

@Component({
  selector: 'next-sales-project-list',
  templateUrl: './next-sales-project-list.component.html',
  styleUrls: ['./next-sales-project-list.component.scss']
})
export class NextSalesProjectListComponent implements OnInit {

  project;
  projectId;
  currentLoginCompanyId;
  isLoading;

  projectList;
  currUser_id;
  
  // ownerPermission is the permission of the owner of the project, because only owner can generate new meeting
  ownerPermission: boolean = false;

  // max num of share
  maxAdmin: number = 7;
  maxShare = [];

  prevSalesProjectId;

  projectListTotalUnread;

  constructor(
    private businessMeetingService: BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
    private authService : AuthService,    
    private departmentOpportunityService: DepartmentOpportunityService,
    private dialogService: DialogService,
    
  ) { 
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    this.projectId = this.route.snapshot.paramMap.get('oppoPrevProjectId');
    this.isLoading = true;
    this.prevSalesProjectId = this.route.snapshot.paramMap.get('oppoPrevProjectId');     
    
  }

  ngOnInit() {
    this.getCreatedProjectList();
    this.getProjextNextSubjectList();
    this.getCreatedProjectListtotalUnread();
  }

  // get the project list that the current logined user has created as the sales.
  getCreatedProjectList() {
    this.departmentOpportunityService.getCreatedProjectList(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {
        this.projectList = res.data;
        console.log(this.projectList);
        
        this.isLoading = false;
      }
    )
  }

  // get the total unread of the project list that the current logined user has created as the sales.
  getCreatedProjectListtotalUnread() {
    this.departmentOpportunityService.getCreatedProjectListtotalUnread(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {
        this.projectListTotalUnread = res;
        
        this.isLoading = false;
      }
    )
  }

  // get the sales project
  getProjextNextSubjectList() {
    this.departmentOpportunityService.getSalesProjectWithPrevAttachAndNextSubjectList(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {
        this.project = res;

        this.isLoading = false;
      }
    )
  }

  onReceivedFormData(fd){
      // let message = "You cannot upload attachement here. We will hide this function in the future!";          
      // this.dialogService.openAlertDialog(message);
  }

  showDescription(){
    let message = JSON.parse(this.project.subject.description)[0].text;
    this.dialogService.openAlertDialog(message);
  }

}
