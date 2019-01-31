import { Component, OnInit } from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { AuthService } from 'app/core/services/auth.service';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { DialogService } from 'app/core/services/dialog.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { Location } from '@angular/common';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';

@Component({
  selector: 'opportunity-person-project',
  templateUrl: './opportunity-person-project.component.html',
  styleUrls: ['./opportunity-person-project.component.scss']
})
export class OpportunityPersonProjectComponent implements OnInit {

  currentLoginCompanyId;
  projectId;
  project;
  isLoading;
  prevProjectId;
  salesOppoSubjectId;

  currUser_id;

  // createrAndOwnerPermission is the permission of both creater of the subject and owner of project, because both them can add status and reply
  createrAndOwnerPermission: boolean = false;

  // ownerPermission is the permission of the owner of the project, because only owner can generate new meeting
  ownerPermission: boolean = false;

  // superPermission is the permission of the creater of the subject and shared user with admin permission, can delete the project
  superPermission: boolean = false;

  chooseApproval : boolean = false;
  chooseNextProcess : boolean = false;
  waitingApproval : boolean = false;
  showApprove: boolean = false;
  addSKU: boolean = false;


  canApprove: boolean = false;
  canClickNextProcess: boolean = false;

  currentProcessId;
  currentProcessName;
  statusesAndComments;
  departmentOpportunityId;
  processList;
  attachments;
  completedProcessIndex;
  prevProcessList = [];
  nextProcessList = [];
  currentProcess;

  constructor(
    private businessMeetingService: BusinessMeetingService,
    private route: ActivatedRoute,
    private authService : AuthService,    
    private router: Router,
    private dialogService: DialogService,
    private toasterService: ToasterService,
    private location: Location,
    private departmentOpportunityService: DepartmentOpportunityService,
    
  ) {
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    this.projectId = this.route.snapshot.paramMap.get('oppoProjectId');
    this.prevProjectId = this.route.snapshot.paramMap.get('oppoPrevProjectId');
    this.salesOppoSubjectId = this.route.snapshot.paramMap.get('oppoSubjectId');

    this.isLoading = true;
    this.currentProcessId = this.route.snapshot.queryParams['currentProcessId'];
    this.currentProcessName = this.route.snapshot.queryParams['currentProcessName'];
    
   }

  ngOnInit() {
    this.getProject();
    this.getStatusesAndCommentsByProcessId();
    this.getOpportunityProcessFilesbyProcessId();
    this.getOpportunityProcessList();
    
  }

  getProject() {
    this.departmentOpportunityService.getDetailedProductProjectOpportunity(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {
        this.project = res;
        console.log(this.project);
        
        this.isLoading = false;

        // check whether need approve / deny
        if (this.project.current_process_status == 'Waiting Approval' && (this.currentProcessId == this.project.current_process.id || this.currentProcessId == 0)) {
          this.showApprove = true;
        }

        // if the length == 0, which means that this process does not have approval
        // and then if the status is working, which means the user can choose next process
        // or if the length != 0, which means that this process has approval
        // and then if the status is approved, which means the user can choose next process

        // first check whether the sku_process_status is "waitting"
        // if not, then continue to check others
        // if so, addSKU to be true
        if (this.project.sku_process_status != 'waitting') {
          if ((this.project.current_process.process_approvals.length == 0 && this.project.current_process_status == 'In Progress') ||
          (this.project.current_process.process_approvals.length != 0 && this.project.current_process_status == 'Approved')) {               
              
              this.chooseNextProcess = true;        
          }
          // or if the length != 0, which means that this process has approval
          // and then if the status is working, which means the user can choose approval for the process
          // or if the status is Denied, which means this process approval has been denied, the user can still choose approval again.            
          else if (this.project.current_process.process_approvals.length != 0 &&
                  (this.project.current_process_status == 'In Progress' || this.project.current_process_status == 'Denied')){
              this.chooseApproval = true;        
          } 
          // if the status is Waiting Approval, which means the process is waiting for approval , show nothing
          else if (this.project.current_process_status == 'Waiting Approval') {
              this.waitingApproval = true;

          }
        } else if (this.project.current_process.process_name == 'SKU Creation' && this.project.sku_process_status == 'waitting') {
          this.addSKU = true;
        }
        
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

                // check whether the current logined user is the approval people of the current process of the project
                // only the approval people can see the approve / deny button
                if (owners[i].permission == 'Approval' && owners[i].responsible_process_id == this.project.current_process.id && this.project.current_process_status == 'Waiting Approval') {
                  this.canApprove = true;
                }

                // check whether the current logined user is the responsible person of the current process of the project
                // only the person who is responsible for the current orocess of the project can click next process button
                if (owners[i].permission == 'Work' && owners[i].responsible_process_id == this.project.current_process.id ) {
                  this.canClickNextProcess = true;
                }
              }
            }

            // check whether the current logined user is the approval people of the current process of the opportunity
            // only the approval people can see the approve / deny button
            // for (let i=0; i<this.project.current_process.process_approvals.length; i++) {
            //   if (this.currUser_id == this.project.current_process.process_approvals[i].id) {
            //     this.canApprove = true;
            //     break;
            //   }
            // }
          }
        );       

        // after get the project, delete the unread record of the project
        this.deleteUnreadProject();
        // delete the unread record of status and reply
        this.deleteUnreadStatus();
        // delete the unread record of the message and reply (status type is comment)
        this.deleteUnreadComment();
      }
    );
  }

  getStatusesAndCommentsByProcessId() {
    this.departmentOpportunityService.getStatusesAndCommentsByProcessId(this.currentLoginCompanyId, this.projectId, this.currentProcessId).subscribe(
      res => {
        this.statusesAndComments = res;
      }
    )
  }

  getOpportunityProcessFilesbyProcessId() {
    this.departmentOpportunityService.getOpportunityProcessFilesbyProcessId(this.currentLoginCompanyId, this.projectId, this.currentProcessId).subscribe(
      res => {
        this.attachments = res;

      }
    )
  }

  getOpportunityProcessList() {
    // first get the sales_department_opportunity id 
    this.departmentOpportunityService.getSalesDepartmentOpportunity(this.currentLoginCompanyId).subscribe(
      res => {
        this.departmentOpportunityId = res.id;

        // then get the process list of the department opportunity
        this.departmentOpportunityService.getDepartmentOpportunitySubjectProcessList(this.currentLoginCompanyId, this.departmentOpportunityId).subscribe(
          res => {
            this.processList = res.opportunity_processes;

            // check the current process index of process list
            // for the previous process before the current process and the current process, click and jump to the process
            // for after the current process, cannot click
            for (let i=0; i<this.processList.length; i++) {
              if (this.processList[i].id == this.project.current_process.id) {
                this.completedProcessIndex = i;
                break;
              }
            }

            for (let i=0; i<this.processList.length; i++) {
              if (i < this.completedProcessIndex) {
                this.prevProcessList.push(this.processList[i]);
              } else if (i == this.completedProcessIndex) {
                this.currentProcess = this.processList[i];
              } else if (i > this.completedProcessIndex) {
                this.nextProcessList.push(this.processList[i]);
              }
            }
        
          }
        )
      }
    )
  }

  swapProcess(value) {
    this.currentProcessId = value.id;
    this.currentProcessName = value.process_name;
    this.getStatusesAndCommentsByProcessId();
    this.getOpportunityProcessFilesbyProcessId();
  }

  allProcess() {
    this.currentProcessId = 0;
    this.currentProcessName = null;
    this.getStatusesAndCommentsByProcessId();
    this.getOpportunityProcessFilesbyProcessId();
  }

  deleteUnreadProject() {
    this.businessMeetingService.deleteUnreadProject(this.currentLoginCompanyId, this.projectId).subscribe(
      res =>{}
    )
  }

  deleteUnreadStatus() {
    this.businessMeetingService.deleteUnreadStatus(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {    
      }
    )
  }

  deleteUnreadComment() {
    this.businessMeetingService.deleteUnreadComment(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {    
      }
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
        }
    )
  }

  editProject() {
    let message = "coming soon...";
    this.dialogService.openAlertDialog(message);
  }

}
