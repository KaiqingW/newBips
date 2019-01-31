import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap} from '@angular/router';
import { Location } from '@angular/common';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { NotesService } from 'app/core/services/notes.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { DialogService } from 'app/core/services/dialog.service';

import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  @ViewChild('personInput') personInput;

  isLoading = false;

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

  // this email list is for view
  emailList: Array<string> = [];

  // this subject's id
  subjectId;

  // this variable is for change the event order of (matChipInputTokenEnd) in input and (optionSelected) in mat-autocomplete
  selectedEmail;

  // separator to separate user input as chips
  separatorKeysCodes = [ENTER, COMMA];

  // all user list in the database
  allUserList;
  sharedOrNot;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private notesService: NotesService,
              private toasterService: ToasterService,
              private dialogService: DialogService) {
                this.subjectId = +this.route.snapshot.paramMap.get('notesSubId');
                console.log(this.subjectId);
                this.sharedOrNot =localStorage.getItem('key_switch');
                
              }

  ngOnInit() {
    this.isLoading = true;

    // listen to the save button in the header tool bar
    setTimeout(() => {
      const buttonClick = document.getElementById('header-submit-edit');
      buttonClick.addEventListener('click', () => {
        this.onSave(this.personInput);
      });
    }, 0);

    // get all the users, then get all the shared user list of this subject
    // then create observable for mat-autocomplete
    this.notesService.getUserList().subscribe(res => {
      this.allUserList = res.data;
     
      this.notesService.getSharedUserList(this.subjectId).subscribe(res1 => {
        this.sharedUserList = res1;
        const ob = Observable.create(observer => {
          setTimeout(() => {
            observer.next(this.allUserList.slice());
          });
        });
        this.filteredEmails = ob;
        this.emailCtrl.valueChanges.subscribe( email => {
          // if email is not '', then search using search api, else return all the users
          this.filteredEmails = email ? this.notesService.getUserEmailList(email) : ob;
        });
        this.isLoading = false;
      }, err => {this.isLoading = false; console.log(err); });
    }, err => {this.isLoading = false; console.log(err); });
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
  removeSharedUser(user) {
    this.dialogService.openDialog().subscribe(result => {
      if (result) {
        this.notesService.cancelShare(this.subjectId, user.id).subscribe(res => {
          const idx = this.sharedUserList.indexOf(user);
          if (idx > -1) {
            this.sharedUserList.splice(idx, 1);
          }
          this.toasterService.showToaster('Cancel share finished');
        });

      }
    });
  }

  onSave(personInput) {
    // getting personInput.value seems to be async, so use settimeout to change the event loop
    this.addHelper(personInput.value);
    console.log(this.emailList);
    setTimeout(() => {
      // for every email in email list
      for (let i = 0; i < this.emailList.length; i++) {
        // search the user according to the email.
        // if the user exists, then share with this user
        // if not exists, invite this user using addNewShare function and api
        console.log(this.emailList[i]);
        this.notesService.getSpecificUser(this.emailList[i], 'email').subscribe(res => {
          console.log(res.data);
          if (res.data.length !== 0) {
            this.notesService.addShare(this.subjectId, res.data[0].id).subscribe(res1 => {
              console.log(res1);
            });
          } else {
            this.notesService.addNewShare(this.subjectId, this.emailList[i]).subscribe(res1 => {

            });
          }
        });
      }

      if (this.sharedOrNot == 'mysubject') {
        this.router.navigateByUrl('/notes/subject/' + this.subjectId).then(() => {
          this.toasterService.showToaster('Finished Sharing');
        });
      } else if (this.sharedOrNot == 'subjectshared') {
        this.router.navigateByUrl('/notes/subject_shared/' + this.subjectId).then(() => {
          this.toasterService.showToaster('Finished Sharing');
        });
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
