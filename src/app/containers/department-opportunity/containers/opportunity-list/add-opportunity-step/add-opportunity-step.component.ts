import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs/Observable';
import { NotesService } from 'app/core/services/notes.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { CompanyService } from 'app/core/services/company.service';
import { DialogService } from 'app/core/services/dialog.service';
import { AccountService } from 'app/core/services/account.service';
import { LeadService } from 'app/core/services/lead.service';
import { SearchService } from 'app/core/services/search.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import { Location } from '@angular/common';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { ProcessUser, ProcessUserStatus } from 'app/core/models/index';

@Component({
  selector: 'add-opportunity-step',
  templateUrl: './add-opportunity-step.component.html',
  styleUrls: ['./add-opportunity-step.component.scss']
})
export class AddOpportunityStepComponent implements OnInit {

isLoading = false;

// this email list is for view
  emailPermissionList: Array<ProcessUser> = [];
  // employeeProcessStatus: Array<ProcessUserStatus> = [];

// all user list in the database
  currentLoginCompanyId;
  employeeList;

  addProcessForm : FormGroup;
  subjectId;

  addProcessId;
  administratorRequest;
  // the index of emailPermissionList
  i=0;

  fd = new FormData();

    constructor(
        private notesService: NotesService,
        private companyService: CompanyService,
        private dialogService : DialogService,
        private toasterService : ToasterService,
        private route: ActivatedRoute,
        private router: Router,        
        private accountService: AccountService,
        private searchService: SearchService,
        private fb: FormBuilder,
        private location: Location,
        private departmentOpportunityService: DepartmentOpportunityService,
        private businessMeetingService : BusinessMeetingService,
        
    ){
      this.isLoading = true;
      this.currentLoginCompanyId = +this.route.snapshot.paramMap.get('cid');
      this.subjectId = +this.route.snapshot.paramMap.get('oppoSubjectId');
      
      this.createAddProcessForm();
      
    }
    ngOnInit(){
      this.companyService.getCompanyEmployee(this.currentLoginCompanyId).subscribe(
        res2=>{
            this.employeeList = res2;
            this.isLoading = false;    

            // for (let i=0; i<this.employeeList.length; i++) {
            //   let obj = {
            //     'Work' : false,
            //     'Approval' : false
            //   };
            //   this.employeeProcessStatus.push(obj);
            // }
        }
      )
    }

    createAddProcessForm() {
      this.addProcessForm = this.fb.group({
        process_name: [''],
  
      })
    }

  onSave() {

    if (!this.addProcessForm.invalid && this.emailPermissionList.length) {
      this.isLoading = true;

      let process = {
        "process_name" : this.addProcessForm.value.process_name,
        "company_meeting_subject_id" : this.subjectId,
      }

      // first add process, get the add_process from the returned res
      this.departmentOpportunityService.addProcess(this.currentLoginCompanyId, process).subscribe(
        res => {
          this.addProcessId = res.id;

          // then add administrator to the process
          this.addAdministrator();
        },
        err => {
          this.isLoading = false;
        }
      )
      
    } else {
      let message = "Please fill all fields!";                    
      this.dialogService.openAlertDialog(message);
    }
  }

  addAdministrator() {
    if (this.emailPermissionList.length > 0) {
      if (this.i < this.emailPermissionList.length) {

        this.administratorRequest = {
          "administrator_email" : this.emailPermissionList[this.i].email,
          "permission" : this.emailPermissionList[this.i].permission
        }

        this.departmentOpportunityService.addProcessAdministrator(this.currentLoginCompanyId, this.addProcessId, this.administratorRequest).subscribe(
          res => {
            this.i++;
            this.addAdministrator();
          },
          err => {
            this.dialogService.openAlertDialog(err.error.message).subscribe(
              res => {
                this.i++;
                this.addAdministrator();
            
              }
            ); 
            
          }
        )
      } else {

        // when add a new process, upload a new folder of the opportunity subject's attachment
        let content = "http://192.168.50.127:4200/assets/images/icons/folder.png";
        let data = new Blob([content],{ type: 'text/plain' });
        let arrayOfBlob = new Array<Blob>();
        arrayOfBlob.push(data);
        var file = new File(arrayOfBlob, "upload_level_up.png", {type: "text/plain"});
        this.fd.append('file', file, 'upload_level_up.png');
        this.fd.append('category', this.addProcessForm.value.process_name);
        this.fd.append('description', 'text/plain');

        this.businessMeetingService.addSubjectAttachment(this.currentLoginCompanyId, this.subjectId, this.fd).subscribe(
          (res) => {                        
              this.toasterService.showToaster('Finished Setup Process'); 
              this.location.back();    
              this.isLoading = false;
          },
          err => {
            this.isLoading = false;
            this.location.back();        
            console.log("upload attachment error");
          }
        )    
        // end
      
      }
    }
  }

  selectedWorkUser(value, user){
    // check whether has already add the user, and the same permission 
    // if so, remove the user
    // else add the user to the array

    let hasUser = false;

    for (let i=0; i<this.emailPermissionList.length; i++) {
      if (this.emailPermissionList[i].email == user.email && this.emailPermissionList[i].permission == value) {
          hasUser = true;        
          // remove the user from emailPermissionList
          this.emailPermissionList.splice(i, 1);
        
      }
    }

    if (!hasUser) {
      let obj = {
        'email' : user.email,
        'permission' : value
      };
      this.emailPermissionList.push(obj);      
    }

  }

  // addAdministrator() {
  //   if (this.emailPermissionList.length > 0) {
  //     if (this.i < this.emailPermissionList.length) {

  //       this.administratorRequest = {
  //         "administrator_email" : this.emailPermissionList[this.i].email,
  //         "permission" : this.emailPermissionList[this.i].permission
  //       }

  //       this.departmentOpportunityService.addProcessAdministrator(this.currentLoginCompanyId, this.addProcessId, this.administratorRequest).subscribe(
  //         res => {
  //           this.i++;
  //           this.addAdministrator();
  //         },
  //         err => {
  //           this.dialogService.openAlertDialog(err.error.message).subscribe(
  //             res => {
  //               this.i++;
  //               this.addAdministrator();
            
  //             }
  //           ); 
            
  //         }
  //       )
  //     } else {

  //       // when add a new process, upload a new folder of the opportunity subject's attachment
  //       let content = "http://192.168.50.127:4200/assets/images/icons/folder.png";
  //       let data = new Blob([content],{ type: 'text/plain' });
  //       let arrayOfBlob = new Array<Blob>();
  //       arrayOfBlob.push(data);
  //       var file = new File(arrayOfBlob, "upload_level_up.png", {type: "text/plain"});
  //       this.fd.append('file', file, 'upload_level_up.png');
  //       this.fd.append('category', this.addProcessForm.value.process_name);
  //       this.fd.append('description', 'text/plain');

  //       this.businessMeetingService.addSubjectAttachment(this.currentLoginCompanyId, this.subjectId, this.fd).subscribe(
  //         (res) => {                        
  //             this.toasterService.showToaster('Finished Setup Process'); 
  //             this.location.back();    
  //             this.isLoading = false;
  //         },
  //         err => {
  //           this.isLoading = false;
  //           this.location.back();        
  //           console.log("upload attachment error");
  //         }
  //       )    
  //       // end
      
  //     }
  //   }
  // }

  // selectedWorkUser(value, user, index){
  //   // check whether has already add the user, 
  //   // if so, find the user, change the permission
  //   // else add the user to the array

  //   let hasUser = false;

  //   for (let i=0; i<this.emailPermissionList.length; i++) {
  //     if (this.emailPermissionList[i].email == user.email) {
  //       hasUser = true;

  //       if (this.emailPermissionList[i].permission == value) {
  //         // remove the user from emailPermissionList
  //         this.emailPermissionList.splice(i, 1);
  //         // change all work and approval status to be false of the process
  //         this.employeeProcessStatus[index].Work = false;
  //         this.employeeProcessStatus[index].Approval = false;
  //       } else {
  //         this.emailPermissionList[index].permission = value;        
  //         if (value == 'Work') {
  //           this.employeeProcessStatus[index].Work = true;
  //           this.employeeProcessStatus[index].Approval = false;
  //         } else if (value == 'Approval') {
  //           this.employeeProcessStatus[index].Work = false;
  //           this.employeeProcessStatus[index].Approval = true;
  //         }
  //       }
  //     }
  //   }

  //   if (!hasUser) {
  //     let obj = {
  //       'email' : user.email,
  //       'permission' : value
  //     };
  //     this.emailPermissionList.push(obj);
  //     if (value == 'Work') {
  //       this.employeeProcessStatus[index].Work = true;
  //       this.employeeProcessStatus[index].Approval = false;
  //     } else if (value == 'Approval') {
  //       this.employeeProcessStatus[index].Work = false;
  //       this.employeeProcessStatus[index].Approval = true;
  //     }
  //   }
  // }

}
