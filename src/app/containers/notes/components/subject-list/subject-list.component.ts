import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../../../core/services/notes.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { Observable } from 'rxjs/Observable';
import { LoggingUserService } from 'app/core/services/logging-user.service';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss']
})

export class SubjectListComponent implements OnInit {

  constructor(private notesService: NotesService,
            private toasterService: ToasterService,
            private dialogService: DialogService,
            private loggingUserService: LoggingUserService) { }

  // subject list under My Subjects
  mySubjectList;

  // temporary subject list under next page of My Subjects
  mySubjectList2;

  //next will store next URL to fetch for read more subject list
  next = null;

  // subject list under Shared With Me
  sharedSubjectList;

  unreadList;
  unreadSubject:number;
  sharedOrNot;

  isLoading = false;
  unreadMySubjectNumber:number=0;
  unreadSharedWithMeNumber:number=0;
  // shared user list under My Subjects
  mySubjectSharedUserList: Array<Array<any>> = [];

  // shared user list under Shared With Me
  sharedSubjectSharedUserList: Array<Array<any>> = [];

  // current loging user. using service to get.
  currentUser;

   // count mouse wheel
   countMouseWheel = 0;

   // set naximum refresh height
   refreshHeight = 500;

  ngOnInit() {
    this.isLoading = true;
    // get current user
    this.currentUser = this.loggingUserService.user;

    // get my subject list and shared user list first
    this.notesService.getSubjectList().subscribe(
      res => {
       
        this.mySubjectList = res.data;
        this.unreadList = res.unread;
        this.unreadSubject = res.unread.length;
        this.next = res.paging.next;
        localStorage.setItem('key_switch', 'mysubject');
        for(var i=0; i<this.unreadList.length; i++){
          const subjectUnreadId = this.unreadList[i].notes_subject_id;
          const unreadSubjectOb = this.mySubjectList.find(n =>n.id == subjectUnreadId);
          
          if(unreadSubjectOb){
            this.unreadMySubjectNumber=this.unreadMySubjectNumber+1 ;
          }
        }
        this.unreadSharedWithMeNumber = this.unreadSubject - this.unreadMySubjectNumber;
        this.isLoading = false;

      }, err => {
        this.isLoading = false;
      }
    );

  }

  public onMouseWheel(evt) {
    if(evt.deltaY > 0){
      this.countMouseWheel = this.countMouseWheel + evt.deltaY;
    }
    if(this.countMouseWheel > this.refreshHeight){
      if(this.next != null){
        this.refreshHeight = this.refreshHeight * 2;
        // get my next subject list and shared user list next
        this.notesService.getSubjectListnext(this.next).subscribe(
          res => {
            this.mySubjectList2 = res.data;
            for(var i = 0; i< this.mySubjectList2.length; i++){
              this.mySubjectList.push(this.mySubjectList2[i]);
            }
            this.next = res.paging.next;
            // this.getSharedUserList(this.mySubjectList, 0, this.mySubjectSharedUserList);
          }, err => {
            this.isLoading = false;
          }
        );
      }
    }
  }


  // recursion to get all the shared users
  getSharedUserList(subjectList: Array<any>, curr: number, arr: Array<Array<any>>) {
    // get 10 users per subject at most
    if (curr === subjectList.length || curr === 10) { this.isLoading = false; return; }
    this.notesService.getSharedUserList(subjectList[curr].id).subscribe(res => {
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
        this.notesService.deleteSubject(id).subscribe(() => {
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
        this.notesService.cancelShare(subjectId, this.currentUser.id).subscribe(res => {
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
  refreshSharedSubjectList($event) {
    if ($event.index === 0) {
      localStorage.setItem('key_switch', 'mysubject');
      this.sharedOrNot =localStorage.getItem('key_switch');

    } else if ($event.index === 1) {
      localStorage.setItem('key_switch', 'subjectshared');
      this.sharedOrNot =localStorage.getItem('key_switch');
      if (!this.sharedSubjectList) {
        this.isLoading = true;
        this.notesService.getSharedSubjectList().subscribe(res => {
          this.sharedSubjectList = res.data;
          // this.getSharedUserList(this.sharedSubjectList, 0, this.sharedSubjectSharedUserList);
        }, err => {this.isLoading = false; console.log(err); });
      }
    } else {
       alert('index error');
    }
  }

}
