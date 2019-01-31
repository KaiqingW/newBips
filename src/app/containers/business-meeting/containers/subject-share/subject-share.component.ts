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

@Component({
  selector: 'subject-share',
  templateUrl: './subject-share.component.html',
  styleUrls: ['./subject-share.component.scss']
})
export class SubjectShareComponent implements OnInit {

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
  sharedUserAdminList;

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

  // the index of emailList
  i = 0;

  selects = ['Employee', 'CRM', 'VRM'];
  placeholder = "Employee";
  default = "Employee";

  addShareType = "Employee";

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private businessMeetingService: BusinessMeetingService,
              private toasterService: ToasterService,
              private dialogService: DialogService,
              private commonService: CommonService,
              private authService : AuthService,

            ) {
                this.subjectId = +this.route.snapshot.paramMap.get('subjectId');
                this.companyId = +localStorage.getItem("currentLoginCompanyId");   
                this.sharedOrNot =localStorage.getItem('meeting_key_switch');
                this.isLoading = true;
                
                this.emailCtrl.valueChanges.subscribe(
                  (term)=>{
                    this.onSearch(term);
                    this.finalInput = term;
                  }
                )
              }

  ngOnInit() {
    this.getCurrentUser();
    this.getMeetingName();

    // listen to the save button in the header tool bar
    // setTimeout(() => {
    //   const buttonClick = document.getElementById('header-submit-edit');
    //   buttonClick.addEventListener('click', () => {
    //     this.addHelper(this.personInput.value);
    //     if (this.emailList.length > 0 && this.saveOnce) {
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
        this.sharedUserAdminList = res.sharedWithAdmin;
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
      "content": this.projectOwnName + " Invite you to a new meeting "+ "'" + this.meetingName +"'",
      "subject": " You have a new meeting   "+ "'" + this.meetingName + "'",
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
        "content":"You got a new meeting from" + ' ' + this.projectOwnName + ", "+ "Subject name: " + this.meetingName + ". " + "Please login in http://bips.orcasmart.us to check!"
      }
        this.commonService.sendInviteNoticeToUSer(SMSValue).subscribe(
          res=>{
          }
        )
    // }
    } else {
      let message = this.emailList[this.i] + " does not save phone number in OrcaSmart, so we cannot send text message to this user!";
      this.dialogService.openAlertDialog(message).subscribe(
        res => {

        }
      )
    }
  }

  onSave() {
    this.isLoading = true;
    
    // first check i, if this.i < this.emailList.length, add share
    // if not, finished add shares, back
    if (this.i < this.emailList.length) { 
      let request = {
        "shared_to_email": this.emailList[this.i],
        "permission": "Normal"
      }

      // just sent the email to backend, the backend will check whether the email is the employee of the meeting
      // whether we have already shared the meeting to the email
      this.businessMeetingService.addSubjectShare(this.companyId, this.subjectId, request).subscribe(
        res => {
          this.isLoading = false;
          this.checkEmailandMessage = true;
          
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
      let message = "Update sucessfully!";          
      this.dialogService.openAlertDialog(message);
      
      this.toasterService.showToaster('Finished Sharing'); 
      
      // this.location.back();
      this.getMeetingName();

      // clear emailList
      this.emailList.splice(0, this.emailList.length);
      this.i = 0;
    }
  }
  
  getSlectedUserInfo(value){

    if((!this.phoneNumberList.includes(value.phone))&&(value.phone !== "")){
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
  }

  onGetSelect(value) {
  }

  editPermission(value1, value2) {

    let permission;

    if (value2 == 'Admin') {
      permission = 'Normal';
    } else if (value2 == 'Normal') {
      permission = 'Admin';
    }

    let request = {
      "shared_to" : value1,
      "permission" : permission
    };
    
    this.businessMeetingService.editSharePermission(this.companyId, this.subjectId, request).subscribe(
      res => {
        this.isLoading = true;
        this.getMeetingName();

        let message = "Update sucessfully!";          
        this.dialogService.openAlertDialog(message);
      }
    )
  }

}
  