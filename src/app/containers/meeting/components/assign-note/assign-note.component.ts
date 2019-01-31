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
import { NotesService } from 'app/core/services/notes.service';

import { FormControl } from '@angular/forms';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule
} from "@angular/forms";

@Component({
  selector: 'app-assign-note',
  templateUrl: './assign-note.component.html',
  styleUrls: ['./assign-note.component.scss']
})
export class AssignNoteComponent implements OnInit {

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
  
    // get the shared user list of the meeting subject, if the assigned owner is not in the 
    // shared user list, cannot be assigned
    sharedUserList;
    // the email of the creater of the subject
    createrEmail;

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

    sharedSubjectId;

    assignForm: FormGroup;
    requireDateCtrl: FormControl;
    durationTime = 0;
    newDurationTime = "";
  
    constructor(
                private fb: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private location: Location,
                private meetingService: MeetingService,
                private toasterService: ToasterService,
                private dialogService: DialogService,
                private notesService: NotesService,
                private commonService: CommonService) {
                  this.subjectId = +this.route.snapshot.paramMap.get('subId');
                  this.sharedSubjectId = this.route.snapshot.paramMap.get('assignNoteId');
                  this.companyId = +localStorage.getItem("currentLoginCompanyId");   
                  this.sharedOrNot =localStorage.getItem('meeting_key_switch');
                  this.createAssignForm();
                  this.requireDateCtrl = new FormControl();
                  this.requireDateCtrl.valueChanges.subscribe(
                    (term) => {
                      console.log(this.requireDateCtrl.value);
                      this.getDurationTime(this.requireDateCtrl.value);
                      this.newDurationTime = this.durationTime + " days";
                      console.log(this.newDurationTime);
                    }
                  );

                  this.emailCtrl.valueChanges.subscribe(
                    (term)=>{
                      this.onSearch(term);
                      this.finalInput = term;
                    }
                  );

                  this.getSharedUserList();
                  this.getSubject();
                  
                }
  
    ngOnInit() {
      // this.isLoading = true;
  
      // listen to the save button in the header tool bar
      setTimeout(() => {
        const buttonClick = document.getElementById('header-submit-edit');
        buttonClick.addEventListener('click', () => {
          if (!this.assignForm.invalid) {
            this.onSave(this.personInput);          
          } else {
            let message = "Please fill all fields!";
            this.dialogService.openAlertDialog(message);
          }
          
        });
      }, 0);
  
      // get all the shared user list of this subject
      // then create observable for mat-autocomplete
      // this.meetingService.getSharedUserList(this.subjectId).subscribe(res => {
      //   this.filteredEmails = res.valueOf();

      //   this.isLoading = false;
      // }, err => {this.isLoading = false; console.log(err); });
     
    }

    getSharedUserList() {
      this.meetingService.getSharedUserList(this.subjectId).subscribe(
        res => {
          this.sharedUserList = res;
          console.log(this.sharedUserList);
        }
      )
    }

    getSubject() {
      this.meetingService.getSubject(this.subjectId).subscribe(
        res => {
          this.createrEmail = res.created.by.email;
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

    createAssignForm() {
      this.assignForm = this.fb.group({
        duration_time: [""],
        update_frequency: [""]
      });
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
  
    getDurationTime(value) {
      let startDate = new Date();
      let endDate = new Date(value);
      let newEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59);
      console.log(startDate);
      console.log(newEndDate);
      let diffTime = Math.abs(newEndDate.getTime() - startDate.getTime());
      this.durationTime = Math.ceil(diffTime / (1000*60*60*24));
      console.log(this.durationTime);
      return this.durationTime;
    }

    onSave(personInput) {
      // getting personInput.value seems to be async, so use settimeout to change the event loop
      this.addHelper(personInput.value);
      
      console.log(this.emailList);
      setTimeout(() => {
        // for every email in email list
        for (let i = 0; i < this.emailList.length; i++) {
          // check whether the email is in the shared user list of the meeting subject
          let isSharedUserFlag = false;
          if (this.emailList[i] == this.createrEmail) {
            isSharedUserFlag = true;
          } else {
            for (let j=0; j<this.sharedUserList.length; j++) {
              if (this.emailList[i] == this.sharedUserList[j].email) {
                isSharedUserFlag = true;
                break;
              }
            }
          }

          // search the user according to the email.
          // if the user exists, then share with this user
          // if not exists, invite this user using addNewShare function and api
          if (isSharedUserFlag) {
            this.meetingService.getSpecificUser(this.emailList[i], 'email').subscribe(res => {
              console.log(res.data.length);
              if (res.data.length !== 0) {
                console.log(res.data[0]);
                let request = {
                  "share_type": "note_owner",
                  "shared_to": res.data[0].id,
                  "assigned_notes" : this.sharedSubjectId,
                  "require_date" : this.requireDateCtrl.value,
                  "update_frequency" : this.assignForm.value.update_frequency,
                  "duration_time" : this.durationTime
                };
                console.log(request);
                this.meetingService.editShare(this.subjectId, request).subscribe(res1 => {
                  console.log(res1);
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
          } else {
            let message = "The user has not been invied to your meeting yet. Please invite the person to your meeting first!";
            this.dialogService.openAlertDialog(message);
          }
        } 
      }, 0);
  
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
}
