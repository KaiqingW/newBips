import { Component, OnInit} from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { AuthService } from 'app/core/services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { DialogService } from 'app/core/services/dialog.service';
import { ToasterService } from 'app/core/services/toaster.service';

@Component({
  selector: 'subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {

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
  
  constructor(
    private businessMeetingService : BusinessMeetingService,
    private authService : AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dialogService: DialogService,
    private toasterService: ToasterService,
    
  ) {
    this.isLoading = true;
    
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
    this.subject_id = this.route.snapshot.paramMap.get('subjectId');
        
   }

  ngOnInit() {
    this.getSubject();
    
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
          let message = "Your file is too large to upload. Please try a small one. Thanks!";
          this.dialogService.openAlertDialog(message).subscribe(
            res => {

            }
          )
        }
    )
  }

  edit() {
    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/business-meeting/subject/${this.subject_id}/edit-subject`);
    
  }

}
