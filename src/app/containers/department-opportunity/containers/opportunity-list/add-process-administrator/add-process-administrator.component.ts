import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { Location } from '@angular/common';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { Observable } from 'rxjs/Observable';
import { DialogService } from 'app/core/services/dialog.service';
import { CommonService } from 'app/core/services/common.service';
import { FormControl } from '@angular/forms';
import { AuthService } from "app/core/services/auth.service";
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';
import { CompanyService } from 'app/core/services/company.service';
import { ProcessUser } from 'app/core/models/index';

@Component({
  selector: 'add-process-administrator',
  templateUrl: './add-process-administrator.component.html',
  styleUrls: ['./add-process-administrator.component.scss']
})
export class AddProcessAdministratorComponent implements OnInit {

  @ViewChild('personInput') personInput;
  
  isLoading = false;

  // for angular material mat-chip-list and input
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  // for angular material mat-autocomplete
  filteredEmails: Observable<any[]>;

  // check whether user input is valid email address
  emailCtrl: FormControl = new FormControl();
  finalInput;

  // this email list is for view
  emailList: Array<string> = [];
  emailPermissionList: Array<ProcessUser> = [];
  
  // this subject's id
  processId;
  companyId;

  // this variable is for change the event order of (matChipInputTokenEnd) in input and (optionSelected) in mat-autocomplete
  selectedEmail;

  // separator to separate user input as chips
  separatorKeysCodes = [ENTER, COMMA];

  // the index of emailList
  i = 0;
  process;
  employeeList;
  newEmployeeList = [];
  permission;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private businessMeetingService: BusinessMeetingService,
              private toasterService: ToasterService,
              private dialogService: DialogService,
              private commonService: CommonService,
              private authService : AuthService,
              private departmentOpportunityService: DepartmentOpportunityService,
              private companyService: CompanyService,
              
            ) {
              
                this.processId = +this.route.snapshot.paramMap.get('oppoProcessId');
                this.companyId = +localStorage.getItem("currentLoginCompanyId");   
             
                this.isLoading = true;
                
                // this.emailCtrl.valueChanges.subscribe(
                //   (term)=>{
                //     this.onSearch(term);
                //     this.finalInput = term;
                //   }
                // )
              }

  ngOnInit() {
   this.getProcess();
  }

  getCompanyEmployee() {
    this.companyService.getCompanyEmployee(this.companyId).subscribe(
      res => {
        this.isLoading = false;    
        this.employeeList = res;

        // check whether the employee has already been added to be the administrators, 
        // if so, remove the employee from the employeeList

        // first clear newEmplyeeList
        this.newEmployeeList.splice(0, this.newEmployeeList.length);

        let isAdminOrApproval = false;
        for (let i=0; i<this.employeeList.length; i++) {         
          for (let j=0; j<this.process.process_administrators.length; j++) {
            if (this.employeeList[i].id == this.process.process_administrators[j].user_id) {
              isAdminOrApproval = true;
              continue;
            }
          }

          for (let j=0; j<this.process.process_approvals.length; j++) {
            if (this.employeeList[i].id == this.process.process_approvals[j].user_id) {
              isAdminOrApproval = true;
              continue;
            }
          }
          
          if (!isAdminOrApproval) {
            this.newEmployeeList.push(this.employeeList[i]);
          }

          isAdminOrApproval = false;
        }
      }
    )
  }

  getProcess() {
    this.departmentOpportunityService.getProcess(this.companyId, this.processId).subscribe(
      res => {
        this.isLoading = false;
        this.process = res;
        this.getCompanyEmployee();        
      }
    )
  }

  //search input string
  // onSearch(value){
  //   this.businessMeetingService.searchCompanyContact(this.companyId, "email", value).subscribe(
  //     res=>{
  //       this.filteredEmails = res.data;        
  //     }
  //   )
  // }

  // for adding new chips after input token ends
  // add(event: MatChipInputEvent): void {
  //   setTimeout(e => {
  //     const input = event.input;
  //     const value = this.selectedEmail || event.value;
  //     // Add our email
  //     this.addHelper(value);
  //     // Reset the input value
  //     if (input) {
  //       input.value = '';
  //     }
  //     this.selectedEmail = '';
  //   }, 0);
  // }

  // if value is valid email and not included in the emailList, then add it to email list
  // addHelper(value: string): void {
  //   if ((value || '').trim()) {
  //     value = value.trim().toLowerCase();
  //     if (this.validateEmail(value) && !this.emailList.includes(value)) {
  //       this.emailList.push(value);
  //     }
  //   }
  // }

  // remove email from emailList
  // remove(email: any): void {
  //   const index = this.emailList.indexOf(email);
  //   if (index >= 0) {
  //     this.emailList.splice(index, 1);
  //   }
  // }

  // remove shared user and updating the view
  // removeSharedUser(user) {
  //   this.dialogService.openDialog().subscribe(result => {
  //     if (result) {
  //       this.meetingService.cancelShare(this.subjectId, user.id).subscribe(res => {
  //         const idx = this.sharedUserList.indexOf(user);
  //         if (idx > -1) {
  //           this.sharedUserList.splice(idx, 1);
  //         }
  //         this.toasterService.showToaster('Cancel share finished');
  //       });

  //     }
  //   });
  // }


  
  onSave() {    
    // first check i, if this.i < this.emailList.length, add administrator
    // if not, finished add , back
    if (this.i < this.emailPermissionList.length) { 
      this.isLoading = true;
    
      let request = {
        "administrator_email" : this.emailPermissionList[this.i].email,
        "permission" : this.emailPermissionList[this.i].permission
      }

      // just sent the email to backend, the backend will check whether the email is the employee of the company
      // whether we have already add this user to the process
      this.departmentOpportunityService.addProcessAdministrator(this.companyId, this.processId, request).subscribe(
        res => {
          this.isLoading = false;     
          this.i++;
          this.onSave();     
        },
        err => {
          this.isLoading = false;
          this.dialogService.openAlertDialog(err.error.message).subscribe(
            res => {
              this.i++;
              this.onSave();
          
            }
          ); 
          // setTimeout(e => {
          //   this.location.back();
          // }, 3000);          
        }
      )
    } else {
      this.isLoading = false;
      let message = "Update sucessfully!";          
      this.dialogService.openAlertDialog(message);
      
      this.toasterService.showToaster('Finished'); 
      
      // clear emailPermissionList
      this.emailPermissionList.splice(0, this.emailPermissionList.length);
      this.i = 0;

      this.getProcess();
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

  // selectedWorkUser(value, user){
  //   // check whether has already add the user, 
  //   // if so, find the user, change the permission
  //   // else add the user to the array

  //   let hasUser = false;

  //   for (let i=0; i<this.emailPermissionList.length; i++) {
  //     if (this.emailPermissionList[i].email == user.email) {
  //       this.emailPermissionList[i].permission = value;
  //       hasUser = true;
  //     }
  //   }

  //   if (!hasUser) {
  //     let obj = {
  //       'email' : user.email,
  //       'permission' : value
  //     };
  //     this.emailPermissionList.push(obj);
  //   }
  // }
  
  // getSlectedUserInfo(value){

  // }
  // In default, add function add runs before selectOption.
  // To change the event order, set timeout in add function and use selectedEmail to pass the clicked value from autocomplete list
  // selectOption(event) {
  //   this.selectedEmail = event.option.value;
  // }

  // validateEmail(email) {
  //   const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   return re.test(email);
  // }

  // onGetSelect(value) {
  // }

  deleteAdministrator(user) {
    let message = "Are you sure to delete this user from the process?"
    
    this.dialogService.openCustomizedSureDialog(message).subscribe(
      res => {
        if (res) {
          this.isLoading = true;
          this.departmentOpportunityService.deleteProcessAdministrator(this.companyId, this.processId, user.id).subscribe(
            res => {
              // this.location.back();
              // this.toasterService.showToaster('Deleted Meeting!', '', 3000);   
              this.isLoading = false; 
              this.getProcess();
            }
          )
        }
      }
    )
  }

  editPermission(value) {
    this.isLoading = true;

    if (value.permission == 'Work') {
      this.permission = 'Approval';
    } else if (value.permission == 'Approval') {
      this.permission = 'Work';
    }

    let request = {
      'permission' : this.permission
    };

    this.departmentOpportunityService.editProcessPermission(this.companyId, this.processId, value.id, request).subscribe(
      res => {
        this.isLoading = false;
        this.getProcess();
      },
      err => {
        this.isLoading = false;
      }
    )
    
  }
}

