import { Component, OnInit } from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { AuthService } from 'app/core/services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DialogService } from 'app/core/services/dialog.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { Location } from '@angular/common';

@Component({
  selector: 'subject-project',
  templateUrl: './subject-project.component.html',
  styleUrls: ['./subject-project.component.scss']
})
export class SubjectProjectComponent implements OnInit {

  currentLoginCompanyId;
  projectId;
  project;
  isLoading;

  currUser_id;

  // createrAndOwnerPermission is the permission of both creater of the subject and owner of project, because both them can add status and reply
  createrAndOwnerPermission: boolean = false;

  // ownerPermission is the permission of the owner of the project, because only owner can generate new meeting
  ownerPermission: boolean = false;

  // superPermission is the permission of the creater of the subject and shared user with admin permission, can delete the project
  superPermission: boolean = false;

  commentType = "project";

  constructor(
    private businessMeetingService: BusinessMeetingService,
    private route: ActivatedRoute,
    private authService : AuthService,    
    private router: Router,
    private dialogService: DialogService,
    private toasterService: ToasterService,
    private location: Location,
    
  ) {
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.isLoading = true;
    
   }

  ngOnInit() {
    this.getProject();
  }

  getProject() {
    this.businessMeetingService.getProject(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {
        this.project = res;
        
        this.isLoading = false;
        
        // get the current logined user, check whether the user is the creater of the project and the shared user with admin or the owner of the project
        // if so, superPermission = true; createrAndOwnerPermission = true;

        this.authService.getCurrentUserBrief().subscribe(
          res => {
            // currUser_id is the user's id in orcasmaer database
            this.currUser_id = res.user.id;

            // this.project.created.by.id is the contact's id in company database
            // so that we need to compare currUser_id and this.project.created.by.user_id
            if (this.currUser_id == this.project.subject.created.by.user_id) {
              this.createrAndOwnerPermission = true;
              this.superPermission = true;
            } else {
              if (this.project.subject.sharedWithAdmin.length > 0) {
                this.project.subject.sharedWithAdmin.forEach(element => {
                  if (this.currUser_id == element.user_id) {
                    this.createrAndOwnerPermission = true;
                    this.superPermission = true;
                  }
                })
              }
            }

            // check whether the current user is owner of the project, if so, they can generate new meeting
            let owners = this.project.owners;
            for (let i=0; i<owners.length; i++) {
              if (owners[i].user_id == this.currUser_id) {
                this.createrAndOwnerPermission = true;
                this.ownerPermission = true;
              }
            }
          }
        );       

        // after get the project, delete the unread record of the project
        this.deleteUnreadProject();
        // delete the unread record of status and reply
        this.deleteUnreadStatus();
      }
    );
  }

  deleteUnreadProject() {
    this.businessMeetingService.deleteUnreadProject(this.currentLoginCompanyId, this.projectId).subscribe(
      res =>{}
    )
  }

  deleteUnreadStatus() {
    this.businessMeetingService.deleteUnreadStatus(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {}
    )
  }

  // the creater of the project can delete the project
  deleteProject() {
    let message = "Are you sure to delete this project?"
    
    this.dialogService.openCustomizedSureDialog(message).subscribe(
      res => {
        if (res) {
          this.isLoading = true;
          
          this.businessMeetingService.deleteProject(this.currentLoginCompanyId, this.projectId).subscribe(
            res => {
              this.location.back();
              this.toasterService.showToaster('Deleted Project!', '', 3000);
            }
          )
        }
      }
    )
  }

  onReceivedFormData(fd){
    this.isLoading = true;
    this.businessMeetingService.addProjectAttachment(this.currentLoginCompanyId, this.projectId, fd).subscribe(
        (res) => {
            this.isLoading = false;
            this.getProject();
        },
        err => {
          this.isLoading = false;
          console.log("upload attachment error");
          let message = "Your file is too large to upload. Please try a small one. Thanks!";
          this.dialogService.openAlertDialog(message).subscribe(
            res => {

            }
          )
        }
    )
  }

}
