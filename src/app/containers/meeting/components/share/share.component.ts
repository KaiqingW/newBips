import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { Location } from '@angular/common';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { MeetingService } from 'app/core/services/meeting.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { DialogService } from 'app/core/services/dialog.service';
import { CommonService } from 'app/core/services/common.service';
import { CompanyService } from 'app/core/services/company.service';
import { FormControl } from '@angular/forms';
import { NotesService } from 'app/core/services/notes.service';
import { AuthService } from "app/core/services/auth.service";
import { StoreState } from 'app/core/models';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

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

  // this variable is for change the event order of (matChipInputTokenEnd) in input and (optionSelected) in mat-autocomplete
  selectedEmail;

  // separator to separate user input as chips
  separatorKeysCodes = [ENTER, COMMA];

  // all user list in the database
  allUserList;

  sharedOrNot;

  // get the employee of the company
  // for the company meeting, if the shared user is not the employee of the company,
  // cannot shared to that user
  companyEmployee;
  sendEmailCheck:boolean= true;
  sendMessageCheck:boolean = false;
  checkEmailandMessage:boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private meetingService: MeetingService,
              private toasterService: ToasterService,
              private dialogService: DialogService,
              private commonService: CommonService,
              private notesService: NotesService,
              private companyService : CompanyService,
              private authService : AuthService,
              private store: Store<StoreState>,

            ) {
                this.subjectId = +this.route.snapshot.paramMap.get('subId');
                this.companyId = +localStorage.getItem("currentLoginCompanyId");   
                this.sharedOrNot =localStorage.getItem('meeting_key_switch');

                this.emailCtrl.valueChanges.subscribe(
                  (term)=>{
                    this.onSearch(term);
                    this.finalInput = term;
                  }
                )
              }

  ngOnInit() {
    this.isLoading = true;
    this.getCurrentUser();
    this.getMeetingName();

    // listen to the save button in the header tool bar
    setTimeout(() => {
      const buttonClick = document.getElementById('header-submit-edit');
      buttonClick.addEventListener('click', () => {
        this.addHelper(this.personInput.value);
        if (this.emailList.length > 0) {
          this.onSave();       
        } else {
          let message = "Please fill all fields!";          
          this.dialogService.openAlertDialog(message);
        }
      });
    }, 0);

    // get all the users, then get all the shared user list of this subject
    // then create observable for mat-autocomplete
    this.meetingService.getUserList().subscribe(res => {
      this.allUserList = res.data;
      // console.log(this.allUserList);
      
      this.meetingService.getSharedUserList(this.subjectId).subscribe(res1 => {
        this.sharedUserList = res1;
        
        // const ob = Observable.create(observer => {
        //   setTimeout(() => {
        //     observer.next(this.allUserList.slice());
        //   });
        // });
        // this.filteredEmails = ob;
        // this.emailCtrl.valueChanges.subscribe( email => {
        //   // if email is not '', then search using search api, else return all the users
        //   this.filteredEmails = email ? this.meetingService.getUserEmailList(email) : ob;
        // });
        this.isLoading = false;
      }, err => {this.isLoading = false; console.log(err); });
    }, err => {this.isLoading = false; console.log(err); });

    // if (this.companyId > 0) {
    // this.getCompanyEmployee();    
    // }
  }

  getCurrentUser(){
    if (this.authService.getOrcaToken()) {
      this.isLoading = true;
          this.authService.getCurrentUser().subscribe(
              data => {
              this.projectOwnName = data.user.first_name + ' '+ data.user.last_name;
              // console.log(this.projectOwnName);
              this.isLoading = false;
              },
              err => {
              this.isLoading = false;
              }
          );
  }
  }

  getMeetingName(){
    this.meetingService.getSubject(this.subjectId).subscribe(
      res=>{

        this.meetingName = res.name;
      }
    )
  }
  //search input string
  onSearch(value){
    this.notesService.getUserEmailList(value).subscribe(
      res=>{
        this.filteredEmails = res;
      }
    )
  }

  // getCompanyEmployee() {
  //   this.companyService.getCompanyEmployee(this.companyId).subscribe(
  //     res => {
  //       this.companyEmployee = res;
  //       console.log(this.companyEmployee);
  //     },
  //     err => {
  //       console.log("get company emplyee error!");
  //     }
  //   )
  // }

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
        // console.log(this.emailList);
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
  removeSharedUser(user) {
    this.dialogService.openDialog().subscribe(result => {
      if (result) {
        this.meetingService.cancelShare(this.subjectId, user.id).subscribe(res => {
          const idx = this.sharedUserList.indexOf(user);
          if (idx > -1) {
            this.sharedUserList.splice(idx, 1);
          }
          this.toasterService.showToaster('Cancel share finished');
        });

      }
    });
  }

  sendEmailtoUser(){
     //send email to invited user
     let EmailValue = {
      "emails": this.emailList,
      "content": this.projectOwnName + " Invite you to a new meeting "+ "'" + this.meetingName +"'",
      "subject": " You have a new meeting   "+ "'" + this.meetingName + "'",
    };
    // console.log(EmailValue);
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
      // console.log(SMSValue);
        this.commonService.sendInviteNoticeToUSer(SMSValue).subscribe(
          res=>{
            
          }
        )
    }else{
      // console.log("no phone number")
    }
   
    
  }

  onSave() {
    // getting personInput.value seems to be async, so use settimeout to change the event loop
    setTimeout(() => {
      // for every email in email list
      for (let i = 0; i < this.emailList.length; i++) {
        // search the user according to the email.
        // if the user exists, then share with this user
        // if not exists, invite this user using addNewShare function and api
        // console.log(this.emailList[i]);

        // now share to everyone
        // let isEmployeeFlag = false;
        // if (this.companyId > 0) {
        //   for (let j=0; j<this.companyEmployee.length; j++) {
        //     if (this.emailList[i] == this.companyEmployee[j].email) {
        //       isEmployeeFlag = true;
        //       break;
        //     }
        //   }
        // }
        // if (isEmployeeFlag || this.companyId == 0) {
          this.meetingService.getSpecificUser(this.emailList[i], 'email').subscribe(res => {       
            if (res.data.length != 0) {
              // console.log(res.data[0]);
              let request = {
                "share_type": "super_view",
                "shared_to": res.data[0].id,
                "assigned_notes" : "",
                "company_id" : this.companyId
              };
              this.meetingService.addShare(this.subjectId, request).subscribe(res1 => {
                // console.log(res1);
                // this.commonService.sendMeetingNoticeToUSer().subscribe(
                //   res => {                 
                //   }
                // );

               
              });
            } else {
              this.meetingService.addNewShare(this.subjectId, this.emailList[i]).subscribe(res1 => {

              });
            }
          });
        // } else {
        //   alert("The user is not your company's employee. Please invite the person to your company first");
        // }
      }
      
   
      
      // if (this.sharedOrNot == 'myMeeting') {
      //   if (this.companyId > 0) {
      //     this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject/` + this.subjectId).then(() => {
      //       this.toasterService.showToaster('Finished Sharing');
      //     });
      //   } else if (this.companyId == 0) {
      //     this.router.navigateByUrl(`/personal-meeting/meeting/subject/` + this.subjectId).then(() => {
      //       this.toasterService.showToaster('Finished Sharing');
      //     });
      //   }
      // } else if (this.sharedOrNot == 'sharedMeeting') {
      //   if (this.companyId > 0) {
      //     this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject_shared/` + this.subjectId).then(() => {
      //       this.toasterService.showToaster('Finished Sharing');
      //     });
      //   } else if (this.companyId == 0) {
      //     this.router.navigateByUrl(`/personal-meeting/meeting/subject_shared/` + this.subjectId).then(() => {
      //       this.toasterService.showToaster('Finished Sharing');
      //     });
      //   }
      // }
    }, 0);

    this.checkEmailandMessage = true;

  }

  checkShareType(){
    if (this.sharedOrNot == 'myMeeting') {
      if (this.companyId > 0) {
        this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject/` + this.subjectId).then(() => {
          this.toasterService.showToaster('Finished Sharing');
        });
      } else if (this.companyId == 0) {
        this.router.navigateByUrl(`/personal-meeting/meeting/subject/` + this.subjectId).then(() => {
          this.toasterService.showToaster('Finished Sharing');
        });
      }
    } else if (this.sharedOrNot == 'sharedMeeting') {
      if (this.companyId > 0) {
        this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject_shared/` + this.subjectId).then(() => {
          this.toasterService.showToaster('Finished Sharing');
        });
      } else if (this.companyId == 0) {
        this.router.navigateByUrl(`/personal-meeting/meeting/subject_shared/` + this.subjectId).then(() => {
          this.toasterService.showToaster('Finished Sharing');
        });
      }
    }
  }
  
  getSlectedUserInfo(value){

    if((!this.phoneNumberList.includes(value.phone_number))&&(value.phone_number !== null)){
      this.phoneNumberList.push(value.phone_number);
      // console.log(this.phoneNumberList);
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
        this.checkShareType();
  }

  conformNotifyMethod(){
    this.checkEmailandMessage = false;

    if(this.sendEmailCheck){
      this.sendEmailtoUser();
    }
    if(this.sendMessageCheck){
      // console.log("send");
      this.sendMessgaeToUser();
    }
    this.checkShareType();
  }
}
