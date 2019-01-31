import { Component, OnInit} from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { AuthService } from 'app/core/services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { DialogService } from 'app/core/services/dialog.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';

@Component({
  selector: 'next-sales-opportunity-subject',
  templateUrl: './next-sales-opportunity-subject.component.html',
  styleUrls: ['./next-sales-opportunity-subject.component.scss']
})
export class NextSalesOpportunitySubjectComponent implements OnInit {

  currentLoginCompanyId;
  subject;
  subject_id;
  isLoading;
  prevProjectId;

  prevMeetingProject;
  projectList;
  project;

  currUser_id;
  // creater of the subject and shared user with admin permission have super permission
  superPermission: boolean = false;

  // max num of share
  maxAdmin: number = 7;
  maxShare: number = 0;

  // skuAndQuotePermissionArr records the permission whether the current logined user has the permission to add sku and quote for the current process of the project
  // in html file, loop the skuAndQuotePermissionArr, and check the permission for each project
  skuAndQuotePermissionArr: boolean[] = [];
  
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
    this.prevProjectId = this.route.snapshot.paramMap.get('oppoPrevProjectId');
    
   }

  ngOnInit() {
    this.getSubject();
    this.browseProjectListBySubjectAndUser();
    this.getProjextNextSubjectList();
    
  }

  getSubject() {
    this.departmentOpportunityService.getSubject(this.currentLoginCompanyId, this.subject_id).subscribe(
      res => {
        this.subject = res;      
        console.log(this.subject);
        
        this.isLoading = false;

        this.maxShare = (this.maxAdmin - this.subject.sharedWithAdmin.length > 0) ? this.maxAdmin - this.subject.sharedWithAdmin.length : 0;

        // for oppo, does not need to show
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

  // look at backend, DepartmentOpportunityProjectController -> browseProjectListBySubjectAndUser
  // if the current user is the creater of the main opportunity subject or the crm opportunity subject, 
  // then he can see all project list of the crm opportunity subject
  // if the current user is the shared admin of the main department subject, 
  // then he can see all project list of the crm opportunity subject
  browseProjectListBySubjectAndUser() {
    this.departmentOpportunityService.browseProjectListBySubjectAndUser(this.currentLoginCompanyId, this.subject_id).subscribe(
      res => {
        this.projectList = res;

        for (let j=0; j<this.projectList.length; j++) {
          let owners = this.projectList[j].owners;
          for (let i=0; i<owners.length; i++) {
            if (owners[i].user_id == this.currUser_id) {

              // check whether the current logined user is the responsible person of the current process of the project
              // only the person who is responsible for the current orocess of the project can click next process button
              if (owners[i].permission == 'Work' && owners[i].responsible_process_id == this.projectList[j].current_process.id ) {
                this.skuAndQuotePermissionArr[j] = true;
              } else {
                this.skuAndQuotePermissionArr[j] = false;
                
              }
            }
          }
        }

      }
    )
  }

  // get previous sales project of the current subject
  // get the attachment of main opportunity subject by prev sales project
  getProjextNextSubjectList() {
    this.departmentOpportunityService.getSalesProjectWithPrevAttachAndNextSubjectList(this.currentLoginCompanyId, this.prevProjectId).subscribe(
      res => {
        this.project = res;

        this.isLoading = false;
      }
    );
  }

  deleteUnreadSubject() {
    this.businessMeetingService.deleteUnreadSubject(this.currentLoginCompanyId, this.subject_id).subscribe(
      res => {}
    )
  }

  // the creater of the subject can delete the subject
  deleteSubject() {
    let message = "Are you sure to delete this meeting?"
    
    this.dialogService.openCustomizedSureDialog(message).subscribe(
      res => {
        if (res) {
          this.isLoading = true;
          this.businessMeetingService.deleteSubject(this.currentLoginCompanyId, this.subject_id).subscribe(
            res => {
              this.location.back();
              this.toasterService.showToaster('Deleted Meeting!', '', 3000);   
              this.isLoading = false;         
            }
          )
        }
      }
    )
  }

  finishSubject() {
    let message = "Are you sure that this meeting has been finished?"
    this.dialogService.openCustomizedSureDialog(message).subscribe(
      res => {
        if (res) {
          this.isLoading = true;
          let request = {
            "active": 0
          };

          this.businessMeetingService.finishSubject(this.currentLoginCompanyId, this.subject_id, request).subscribe(
            res => {
              this.location.back();
              this.toasterService.showToaster('Finished Meeting!', '', 3000);            
              this.isLoading = false;
            }
          )
        }
      }
    )
  }

  onReceivedFormData(fd){
    this.isLoading = true;
    this.businessMeetingService.addSubjectAttachment(this.currentLoginCompanyId, this.subject.id, fd).subscribe(
        (res) => {
            this.isLoading = false;
            this.getSubject();
        },
        err => {
          this.isLoading = false;
          console.log("upload attachment error");
        }
    )
  }

  edit() {
    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/department-opportunity/opportunity-subject/${this.subject_id}/edit-opportunity-subject`);
    
  }

}

