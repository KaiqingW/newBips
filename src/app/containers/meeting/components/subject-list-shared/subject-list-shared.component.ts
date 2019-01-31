import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../../../../core/services/meeting.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { Observable } from 'rxjs/Observable';
import { LoggingUserService } from 'app/core/services/logging-user.service';
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subject-list-shared',
  templateUrl: './subject-list-shared.component.html',
  styleUrls: ['./subject-list-shared.component.scss']
})

export class SubjectListSharedComponent implements OnInit {

  constructor(private meetingService: MeetingService,
            private toasterService: ToasterService,
            private dialogService: DialogService,
            private loggingUserService: LoggingUserService) {
              this.companyId = +localStorage.getItem("currentLoginCompanyId");              
             }

  // subject list under My Subjects
  mySubjectList;

  // subject list under Shared With Me
  sharedSubjectList;

  unreadList;
  unreadSubject:number;

  isLoading = false;

  unreadMySubjectNumber:number=0;
  unreadSharedWithMeNumber:number=0;

  // shared user list under My Subjects
  mySubjectSharedUserList: Array<Array<any>> = [];

  // shared user list under Shared With Me
  sharedSubjectSharedUserList: Array<Array<any>> = [];

  // current loging user. using service to get.
  currentUser;

  companyId = 0;

  ngOnInit() {
    this.isLoading = true;
    // get current user
    this.currentUser = this.loggingUserService.user;

    localStorage.setItem('meeting_key_switch', 'sharedMeeting');
    if (!this.sharedSubjectList) {
        this.isLoading = true;
        this.meetingService.getSharedSubjectList('company_id', this.companyId).subscribe(res => {
         
          this.sharedSubjectList = res.data;
          console.log(this.sharedSubjectList);
          
          this.unreadList = res.unread;
          this.unreadSubject = res.unread.length;

          for(var i=0; i<this.unreadList.length; i++){
            const subjectUnreadId = this.unreadList[i].meeting_subject_id;
            const unreadSubjectOb = this.sharedSubjectList.find(n =>n.id === subjectUnreadId);
            if(unreadSubjectOb){
              this.unreadSharedWithMeNumber=this.unreadSharedWithMeNumber+1 ;
            }
          }
          this.unreadMySubjectNumber = this.unreadSubject - this.unreadSharedWithMeNumber;
          // this.getSharedUserList(this.sharedSubjectList, 0, this.sharedSubjectSharedUserList);
          this.isLoading = false;

        }, err => {this.isLoading = false; console.log(err); });
      }
  }

  // recursion to get all the shared users
  getSharedUserList(subjectList: Array<any>, curr: number, arr: Array<Array<any>>) {
    // get 10 users per subject at most
    if (curr === subjectList.length || curr === 10) { this.isLoading = false; return; }
    this.meetingService.getSharedUserList(subjectList[curr].id).subscribe(res => {
      arr.push(res);
      this.getSharedUserList(subjectList, ++curr, arr);
    }, err => {
      this.isLoading = false;
    });
  }

  // delete subject in My Subjects
  delete(id) {
    this.dialogService.openDialog().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.meetingService.deleteSubject(id).subscribe(() => {
          this.toasterService.showToaster('Deleted!', '', 3000);
          const idx = this.mySubjectList.findIndex(n => n.id === id);
          if (idx > -1) {
            this.mySubjectList.splice(idx, 1);
          }
          this.isLoading = false;
        });
      }
    });
  }

  // quit subject in Shared With Me
  quit(subjectId) {
    console.log(subjectId);
    this.dialogService.openDialog().subscribe(result => {
      if (result) {
        this.meetingService.cancelShare(subjectId, this.currentUser.id).subscribe(res => {
          const idx = this.sharedSubjectList.findIndex(n => n.id === subjectId);
          if (idx > -1) {
            this.sharedSubjectList.splice(idx, 1);
          }
          this.toasterService.showToaster('Cancel share finished');
        });


      }
    });
  }

  // when change the tab, if it is the first time to click shared with me,
  // then get shared subject list
//   refreshSharedSubjectList($event) {
//     if ($event.index === 0) {
      
//       localStorage.setItem('key_switch', 'mysubject');
//       this.sharedOrNot =localStorage.getItem('key_switch');


//     } else if ($event.index === 1) {
//       localStorage.setItem('key_switch', 'subjectshared');
//       this.sharedOrNot =localStorage.getItem('key_switch');
//       if (!this.sharedSubjectList) {
//         this.isLoading = true;
//         this.notesService.getSharedSubjectList().subscribe(res => {
//           this.sharedSubjectList = res.data;
//           this.getSharedUserList(this.sharedSubjectList, 0, this.sharedSubjectSharedUserList);
//         }, err => {this.isLoading = false; console.log(err); });
//       }
//     } else {
//        alert('index error');
//     }
//   }

}
