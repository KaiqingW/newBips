import { Component, OnInit} from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { AuthService } from 'app/core/services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { DialogService } from 'app/core/services/dialog.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';

@Component({
  selector: 'others-shared-opportunity-list',
  templateUrl: './others-shared-opportunity-list.component.html',
  styleUrls: ['./others-shared-opportunity-list.component.scss']
})
export class OthersSharedOpportunityListComponent implements OnInit {

  currentLoginCompanyId;
  subject;
  subject_id;
  isLoading;

  prevMeetingProject;

  currUser_id;
  // creater of the subject and shared user with admin permission have super permission
  superPermission: boolean = false;

  // max num of share
  maxAdmin: number = 7;
  maxShare: number = 0;

  departmentOpportunityId;

  sharedOpportunities;
  
  constructor(
    private businessMeetingService : BusinessMeetingService,
    private authService : AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dialogService: DialogService,
    private toasterService: ToasterService,
    private departmentOpportunityService: DepartmentOpportunityService,
    
  ) {
    this.isLoading = true;
    
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    this.subject_id = this.route.snapshot.paramMap.get('oppoSubjectId');
    this.getSalesDepartmentOpportunity();
    
   }

  ngOnInit() {
    this.getSubject();
    this.getSharedOpportunityList();
  }

  getSubject() {
    this.businessMeetingService.getSubject(this.currentLoginCompanyId, this.subject_id).subscribe(
      res => {
        this.subject = res;        
        this.isLoading = false;

        this.maxShare = (this.maxAdmin - this.subject.sharedWithAdmin.length > 0) ? this.maxAdmin - this.subject.sharedWithAdmin.length : 0;

        // if the subject has previous project, show the previous project in the top
        // if (this.subject.prev_meeting_project != null) {
        //   this.businessMeetingService.getBriefProject(this.currentLoginCompanyId, this.subject.prev_meeting_project.id).subscribe(
        //     res => {
        //       this.prevMeetingProject = res;
        //       console.log(this.prevMeetingProject);
        //     }
        //   )
        // }
        
        //get the current user, check whether the user is the creater of the subject, or the shared user with admin permission,
        // which means that super permission
        this.authService.getCurrentUserBrief().subscribe(
          res => {
            this.currUser_id = res.user.id;
           
            if (this.currUser_id == this.subject.created.by.user_id) {
              this.superPermission = true;
            } else {
              if (this.subject.sharedWithAdmin.length > 0) {                
                this.subject.sharedWithAdmin.forEach(element => {                  
                  if (this.currUser_id == element.user_id) {
                    this.superPermission = true;
                  }
                });
              }
            }
          }
        );

        //after get the subject, delete the unread subject record
        this.deleteUnreadSubject();
      }
    )
  }

  getSalesDepartmentOpportunity() {
    this.departmentOpportunityService.getSalesDepartmentOpportunity(this.currentLoginCompanyId).subscribe(
        res => {
            if (res != null) {
                this.departmentOpportunityId = res.id;      
            }
        }
    )
  }

  getSharedOpportunityList() {
    this.departmentOpportunityService.getSharedSubjectList(this.currentLoginCompanyId).subscribe(
      res => {
        this.sharedOpportunities = res.data.data;
        this.isLoading = false;
      }
    )
  }

  deleteUnreadSubject() {
    this.businessMeetingService.deleteUnreadSubject(this.currentLoginCompanyId, this.subject_id).subscribe(
      res => {}
    )
  }

  onReceivedFormData(fd){
    // let message = "You cannot upload attachement here. We will hide this function in the future!";          
    // this.dialogService.openAlertDialog(message);

  }

}


