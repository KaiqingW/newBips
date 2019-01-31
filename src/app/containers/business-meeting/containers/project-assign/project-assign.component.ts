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
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule
} from "@angular/forms";

@Component({
  selector: 'project-assign',
  templateUrl: './project-assign.component.html',
  styleUrls: ['./project-assign.component.scss']
})
export class ProjectAssignComponent implements OnInit {

  @ViewChild('personInput') personInput;
  
  isLoading = false;
  projectOwnName;
  meetingName;
  // for angular material mat-chip-list and input
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  // all the shared user list to this subject
  sharedUserList;

  // for angular material mat-autocomplete
  filteredEmails: Observable<any[]>;

  // check whether user input is valid email address
  emailCtrl: FormControl = new FormControl();
  finalInput;

  // this email list is for view
  emailList: Array<string> = [];
  phoneNumberList: Array<string> =[];

  // this subject's id
  subjectId;
  companyId;
  projectId;

  // this variable is for change the event order of (matChipInputTokenEnd) in input and (optionSelected) in mat-autocomplete
  selectedEmail;

  // separator to separate user input as chips
  separatorKeysCodes = [ENTER, COMMA];

  // all user list in the database
  allUserList;

  sharedOrNot;

  // only can save once
  // saveOnce: Boolean = true;  

  // get the employee of the company
  // for the company meeting, if the shared user is not the employee of the company,
  // cannot shared to that user
  companyEmployee;
  sendEmailCheck:boolean= true;
  sendMessageCheck:boolean = false;
  checkEmailandMessage:boolean = false;

  // for form when assign user to a project
  assignForm: FormGroup;
  requireDateCtrl: FormControl;
  updateFrequencyCtrl: FormControl;
  
  durationTime = 0;
  newDurationTime;

  // project
  project;

  request;

  locationBackFlag: boolean = false;

  // default is disabled, then check if require_date is null, enable
  isDisabled: boolean = true;

  // the index of emailList
  i = 0;

  // when click edit, showSubmitButton will be true, then enable submit button
  showSubmitButton: boolean = false;

  constructor(
              private fb: FormBuilder,    
              private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private businessMeetingService: BusinessMeetingService,
              private toasterService: ToasterService,
              private dialogService: DialogService,
              private commonService: CommonService,
              private authService : AuthService,

            ) {
    
                this.subjectId = +this.route.snapshot.paramMap.get('subjectId');
                this.projectId = +this.route.snapshot.paramMap.get('projectId');
                
                this.companyId = +localStorage.getItem("currentLoginCompanyId");   
                this.sharedOrNot =localStorage.getItem('meeting_key_switch');
                this.isLoading = true;
                
                this.createAssignForm();

                this.requireDateCtrl = new FormControl({value: '', disabled: true});
          
                this.updateFrequencyCtrl = new FormControl({value: '', disabled: true});

                this.requireDateCtrl.valueChanges.subscribe(
                  (term) => {
                    this.getDurationTime(this.requireDateCtrl.value);
                    this.newDurationTime = this.durationTime + " days";
                  }
                );

                this.emailCtrl.valueChanges.subscribe(
                  (term)=>{
                    this.onSearch(term);
                    this.finalInput = term;
                  }
                );

                this.getBriefProject();
              }

  ngOnInit() {
    this.getCurrentUser();
    this.getMeetingName();

    // listen to the save button in the header tool bar
    // setTimeout(() => {
    //   const buttonClick = document.getElementById('header-submit-edit');
    //   buttonClick.addEventListener('click', () => {
    //     this.addHelper(this.personInput.value);
    //     if (this.emailList.length > 0 && !this.assignForm.invalid && this.saveOnce) {
    //       this.onSave(); 
    //       this.isLoading = true;
    //       this.saveOnce = false;      
    //     } else {
    //       let message = "Please fill all fields!";          
    //       this.dialogService.openAlertDialog(message);
    //     }
    //   });
    // }, 0);

  }

  getBriefProject() {
    this.businessMeetingService.getBriefProject(this.companyId, this.projectId).subscribe(
      res => {
        this.project = res;
        this.isLoading = false;


        this.getDurationTime(this.project.require_date);

        // if these three fields are null, then enable 
        if (this.project.require_date == null && this.project.duration_time == null && this.project.update_frequency == null) {
          this.isDisabled = false;
          
          this.requireDateCtrl.enable();
          this.updateFrequencyCtrl.enable();          

        }
      }
    )
  }

  enable() {
    // do not show the edit button, and enable
    this.isDisabled = false;
    this.requireDateCtrl.enable();
    this.updateFrequencyCtrl.enable();

    this.showSubmitButton = true;
  }

  // create form for the project when assign owner
  createAssignForm() {
    this.assignForm = this.fb.group({
      duration_time: [""],
      
    });
  }

  // when user input the date, automatically calculate the duration time of the project
  getDurationTime(value) {
    if (value == null) {
      this.durationTime = 0;
      return this.durationTime;
    }
    let startDate = new Date();
    let endDate = new Date(value);
    let newEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59);
    let diffTime = Math.abs(newEndDate.getTime() - startDate.getTime());
    this.durationTime = Math.ceil(diffTime / (1000*60*60*24));
    return this.durationTime;
  }

  // for send email and message
  getCurrentUser(){
    if (this.authService.getOrcaToken()) {
      this.isLoading = true;
          this.authService.getCurrentUser().subscribe(
              data => {
                this.projectOwnName = data.user.first_name + ' '+ data.user.last_name;
                this.isLoading = false;
              },
              err => {
                this.isLoading = false;
              }
          );
    }
  }

  // get meeting name for sent email and messge
  getMeetingName(){
    this.businessMeetingService.getSubject(this.companyId, this.subjectId).subscribe(
      res=>{  
        this.meetingName = res.name;
        // get the shared user list of the subject
        this.sharedUserList = res.sharedWith;
        this.isLoading = false;
      }
    )
  }

  //search input string
  onSearch(value){
    this.businessMeetingService.searchCompanyContact(this.companyId, "email", value).subscribe(
      res=>{
        this.filteredEmails = res.data;        
      }
    )
  }

  // for adding new chips after input token ends
  add(event: MatChipInputEvent): void {
    setTimeout(e => {
      const input = event.input;
      const value = this.selectedEmail || event.value;
      // Add our email
      this.addHelper(value);
      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.selectedEmail = '';
    }, 0);
  }

  // if value is valid email and not included in the emailList, then add it to email list
  addHelper(value: string): void {
    if ((value || '').trim()) {
      value = value.trim().toLowerCase();
      if (this.validateEmail(value) && !this.emailList.includes(value)) {
        this.emailList.push(value);
      }
    }
  }

  // remove email from emailList
  remove(email: any): void {
    const index = this.emailList.indexOf(email);
    if (index >= 0) {
      this.emailList.splice(index, 1);
    }
  }

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

  sendEmailtoUser(){
      //send email to invited user
      let EmailValue = {
      "emails": this.emailList,
      "content": this.projectOwnName + " Invite you to a new project "+ "'" + this.project.name +"'" +' in Meeting ' + "'" + this.meetingName +"'",
      "subject": " You have a new project   "+ "'" + this.project.name + "'" + ' in Meeting ' + "'" + this.meetingName +"'",
    };
    this.commonService.sendBroadcastToCustomer(EmailValue).subscribe(
      res=>{
      }
    )
  }
  
  sendMessgaeToUser(){
    if(this.phoneNumberList.length>0){
      let SMSValue = {
        "phones":this.phoneNumberList,
        "content":"You got a new project " + "'" + this.project.name +"'" + "from" + ' ' + this.projectOwnName + ", "+ "Subject name: " + this.meetingName + ". " + "Please login in http://bips.orcasmart.us to check!"
      }
        this.commonService.sendInviteNoticeToUSer(SMSValue).subscribe(
          res=>{
          }
        )
    } else {
      let message = this.emailList[this.i] + " does not save phone number in OrcaSmart, so we cannot send text message to this user!";
      this.dialogService.openAlertDialog(message).subscribe(
        res => {

        }
      )
    }
  }

  onSave() { 
    if (this.emailList.length > 0) {
      // first check i, if this.i < this.emailList.length, add owner
      // if not, finished add owners, back
      if (this.i < this.emailList.length) { 
        this.request = {
          "company_meeting_subject_id": this.subjectId,
          "assign_owner_email": this.emailList[this.i],
          "permission": "Normal",
          "require_date" : this.requireDateCtrl.value,
          "update_frequency" : this.updateFrequencyCtrl.value,
          "duration_time" : this.durationTime
        }

        // just sent the email to backend, the backend will check whether the email is the employee of the meeting
        // whether we have already shared the meeting to the email
        this.businessMeetingService.addProjectAssignOwner(this.companyId, this.projectId, this.request).subscribe(
          res => {
            this.isLoading = false;    
            this.checkEmailandMessage = true;
            
            // add owner for next email
            // this.i++;
            // this.onSave();
            
          },
          err => {
            this.isLoading = false;      
            let message_arr = err.error.message.split(';');
            if (message_arr[1] == "2") {
              let message = message_arr[0] + " is not in this Meeting! Do you want to share this meeting to the user, and then assign the project to the user?";
              this.dialogService.openCustomizedSureDialog(message).subscribe(
                res => {
                  if (res) {
                    this.isLoading = true;      
                    console.log("share and owner");
                    this.businessMeetingService.addProjectAssignOwnerAndShare(this.companyId, this.projectId, this.request).subscribe(
                      res => {
                        this.isLoading = false;  
                        // add owner for next email
                        this.i++;
                        this.onSave();
                      
                      }
                    )             
                  } else {
                    // add owner for next email
                    this.i++;
                    this.onSave();
                  }
                }
              );
            } else if (message_arr[1] == "1") {
              let message = "This project has already been assigned to " + message_arr[0];
              this.dialogService.openAlertDialog(message).subscribe(
                res => {
                  // add owner for next email
                  this.i++;
                  this.onSave();
                }
              );
            }
            
          }
        )
      } else {
        let message = "Update sucessfully!";          
        this.dialogService.openAlertDialog(message);

        this.toasterService.showToaster('Finished Assigning Project'); 
        
        // this.location.back();

        this.getBriefProject();
        
        // clear emailList
        this.emailList.splice(0, this.emailList.length);
        this.i = 0;
        
        // show edit button
        this.isDisabled = true;

        // disable submit button
        this.showSubmitButton = false;

        // disable input
        this.requireDateCtrl.disable();
        this.updateFrequencyCtrl.disable();  

      }
    }
  }
  
  editProject() {
    if (this.emailList.length == 0) {
    
      let request = {
        "require_date" : this.requireDateCtrl.value,
        "update_frequency" : this.updateFrequencyCtrl.value,
        "duration_time" : this.durationTime
      }

      this.businessMeetingService.editProject(this.companyId, this.projectId, request).subscribe(
        res => {
          let message = "Update sucessfully!";          
          this.dialogService.openAlertDialog(message);

          this.getBriefProject();
          
          this.toasterService.showToaster('Update Sucessfully'); 

          // show edit button          
          this.isDisabled = true;

          // disable submit button
          this.showSubmitButton = false;

          // disable input
          this.requireDateCtrl.disable();
          this.updateFrequencyCtrl.disable();  
        
        }
      )
    }
  }

  getSlectedUserInfo(value){

    if((!this.phoneNumberList.includes(value.phone))&&(value.phone !== null)){
      this.phoneNumberList.push(value.phone);
    }    
  }

  // In default, add function add runs before selectOption.
  // To change the event order, set timeout in add function and use selectedEmail to pass the clicked value from autocomplete list
  selectOption(event) {
    this.selectedEmail = event.option.value;
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  cancelNotifyMethod(){
    this.checkEmailandMessage = false;

    this.i++;
    this.onSave();
  }

  conformNotifyMethod(){
    this.checkEmailandMessage = false;

    if(this.sendEmailCheck){
      this.sendEmailtoUser();
    }
    if(this.sendMessageCheck){
      this.sendMessgaeToUser();
    }

    this.i++;
    this.onSave(); 

    // this.toasterService.showToaster('Finished Sharing');      
    // this.location.back();                 
  }
}
  