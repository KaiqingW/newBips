import { Component, OnInit, ViewChild, Pipe, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { MeetingService } from 'app/core/services/meeting.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { DialogService } from 'app/core/services/dialog.service';
import { LoggingUserService } from 'app/core/services/logging-user.service';
import { AuthService } from 'app/core/services/auth.service';
import { ShowMorePipe } from '../../show-more.pipe';
import { RichText } from 'app/core/models/index';
import {} from "@angular/core";
// PepeTransform to capitaliza the first letter
import { PipeTransform } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { error } from 'util';

@Pipe({name: 'capitalize'})

@Component({
  selector: 'subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit, PipeTransform  {

  // the subject of this component
  subject;

  // subject list under My Subjects
  mySubjectList;

  //shared users information
  shareInfo;
  // max num of share
  maxShare: number = 3;

  isLoading = false;

  // for the image modal after clicking the image
  subjectModalOpen = false;
  discussionModalOpen = false;

  imgSrc = '';
  // for checking whether this subject is shared
  isShared;

  companyId = 0;
  sharedOrNot;

  // ownerList = [];

  currentUser;

  prevNoteUserList = [];
  upperNoteFlag: boolean = false;
  createrFlag: boolean = false;
  leftTime = 0;

  // check whether the meeting subject has discussion 
  discussionFlag: boolean = false;
  discussionId: number;
  discussionProject;
  subNotes: RichText;
  subDiscussioin: RichText;

  @ViewChild('nameInput') nameInput;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private meetingService: MeetingService,
    private toasterService: ToasterService,
    private dialogService: DialogService,
    private loggingUserService: LoggingUserService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.companyId = +localStorage.getItem("currentLoginCompanyId");
    this.sharedOrNot =localStorage.getItem('meeting_key_switch');

   }

  ngOnInit() {
    this.getSubject();

    setTimeout(() => {
      const buttonClick = document.getElementById('header-cancel');
      buttonClick.addEventListener('click', () => {
          this.isLoading = true;
          // this.onCancel();
      });
    }, 0);

  }
 
  getLeftTime(value) {
    let startDate = new Date();
    let endDate = new Date(value);
    let newEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59);
    if((newEndDate.getTime() - startDate.getTime())< 0){
      return this.leftTime =0;
    }else{
      let diffTime = Math.abs(newEndDate.getTime() - startDate.getTime()); 
      this.leftTime = Math.ceil(diffTime / (1000*60*60*24));
      return this.leftTime;
    }
  }

  // transform will capitaliza the first letter from value
  transform(value:any) {
    if (value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }

  //
  showMore(){
    let max = this.maxShare;
    if(max !== Number.MAX_VALUE){
      this.maxShare = Number.MAX_VALUE;
    } else {
      this.maxShare = 3;
    }
  }


  // get this subject's id and check whether it is shared from the url param
  // get subject information including all the notes in the subject
  // use event propagation to deal with events
  getSubject() {
    const user = this.loggingUserService.user;
    const id = +this.route.snapshot.paramMap.get('subId');
    this.isLoading = true;
    this.meetingService.getSubject(id).subscribe(
      res => {
        console.log(res);
        this.subject = res;
        this.isShared = user.id !== res.created.by.id;
        this.subNotes = JSON.parse(this.subject.description);
        console.log(this.subNotes[0].img);
        // setTimeout(() => {
        //   this.nameInput.nativeElement.addEventListener('click', e => {
        //     if (e.target && e.target.nodeName === 'IMG' ) {
        //       this.imgSrc = e.target.currentSrc;
        //       this.modalOpen = true;
        //     }
        //   });
        // }, 3000);

        // get owner list
        // get owner from notes, split string to array, search each user by id
        // reorganize owner to be array
        for (let i=0; i<this.subject.notes.length; i++) {
          // check whether the meeting has discussion part
          // if so, move discussion to the beginning of the notes
          if (this.subject.notes[i].type == "discussion"){
            this.discussionFlag = true;
            this.discussionId = i;

            // seperate discussin and project by type
            this.discussionProject = this.subject.notes[this.discussionId];
            if (this.discussionProject.comments.length > 0) {
            this.subDiscussioin = JSON.parse(this.discussionProject.comments[0].body);          
            }

            this.subject.notes.splice(this.discussionId, 1);         
            break;
          }
        }

        for (let i=0; i<this.subject.notes.length; i++) {
          // get owner list
          if (this.subject.notes[i].owner != null) {
            let ownerId = this.subject.notes[i].owner;
            let ownerIdArr = ownerId.split(",");
            let tempOwnerArr = [];
            for (let j=0; j<ownerIdArr.length; j++) {
              this.meetingService.getSpecificUser(ownerIdArr[j], 'id').subscribe(
                res => {
                  tempOwnerArr.push(res.data[0]);
                }
              );
            }
            this.subject.notes[i].owner = tempOwnerArr;
          }
          // get shared user list from next meeting subject
          if (this.subject.notes[i].next_meeting_subject != null) {
            this.meetingService.getSubject(this.subject.notes[i].next_meeting_subject).subscribe(
              res => {
                console.log(this.subject.notes);
                console.log(res);
                console.log(i);
                this.subject.notes[i].next_subject_share = res.share.with;
              }
            )
          }
          // get the left days of each note
          this.getLeftTime(this.subject.notes[i].require_date);
          this.subject.notes[i].left_time = this.leftTime;
        }

        this.getSubjectList().subscribe(
          res => {

            this.mySubjectList = res.data;
            let selectedSubject = this.mySubjectList.filter((subject, i) => {
              return subject.id === id;
            });

            if (selectedSubject.length > 0) {
              this.shareInfo = selectedSubject[0].share.with;            
            }
          }
        );

        
        // getCurrentUser, check whether the user is the originator of the meeting subject
        this.authService.getCurrentUser().subscribe(
          res => {
            this.currentUser = res.user;
            this.isLoading = false;
            console.log(this.currentUser);
            // get the shared user list of orev meeting note
            if (this.subject.prev_meeting_note != null) {
              this.showUpperMeetingNote(this.subject.prev_meeting_note);

            }
            
            // check whether the current user is the creater of the meeting subject
            if (this.subject.created.by.id == this.currentUser.id) {
              this.createrFlag = true;
 
            }
          },
          err => {
            console.log("get curent user bug!");
          }
        )
      }
    );

    if(id){
      this.meetingService.deleteUnreadSubject(this.companyId, id).subscribe(res=>{});
    }
  }

  // get shared users which inside this subject list.
  getSubjectList(){

    let id = +this.route.snapshot.params.id;

    if(this.isShared){
      return this.meetingService.getSharedSubjectList('company_id', this.companyId);
    } else {
      return this.meetingService.getSubjectList('company_id', this.companyId);
    }

  }

  // delete current subject
  deleteSubject() {
    this.dialogService.openDialog().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.meetingService.deleteSubject(this.subject.id).subscribe(() => {
          if (this.sharedOrNot == 'myMeeting') {
            if (this.companyId > 0) {
              this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject`).then(() => {
                this.toasterService.showToaster('Deleted!', '', 3000);
                this.isLoading = false;
              });
            } else if (this.companyId == 0) {
              this.router.navigateByUrl(`/personal-meeting/meeting/subject`).then(() => {
                this.toasterService.showToaster('Deleted!', '', 3000);
                this.isLoading = false;
              });
            }
          } else if (this.sharedOrNot == 'sharedMeeting') {
            if (this.companyId > 0) {
              this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject_shared`).then(() => {
                this.toasterService.showToaster('Deleted!', '', 3000);
                this.isLoading = false;
              });
            } else if (this.companyId == 0) {
              this.router.navigateByUrl(`/personal-meeting/meeting/subject_shared`).then(() => {
                this.toasterService.showToaster('Deleted!', '', 3000);
                this.isLoading = false;
              });
            }
          }
        });
      }
    });
  }

  // delete selected notes.
  deleteNote(id) {
    this.dialogService.openDialog().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.meetingService.deleteNote(id).subscribe(() => {
          this.toasterService.showToaster('Deleted!', '', 3000);
          // for changing the view
          const idx = this.subject.notes.findIndex(x => x.id === id);
          if (idx > -1) {
            this.subject.notes.splice(idx, 1);
          }
          this.isLoading = false;
        });
      }
    });
  }

  // close the image modal
  closeModal(){
    this.subjectModalOpen = false;
    this.discussionModalOpen = false;
  }

  openSubjectModal(){
    this.subjectModalOpen = true;  
  }

  openDiscussionModal(){
    this.discussionModalOpen = true;  
  }

  // onCancel() {
  //   if(localStorage.getItem('key_switch')=="subjectshared"){
  //   const id = +this.route.snapshot.paramMap.get('subId');
  //   this.router.navigate([`/notes/subject_shared`]);

  //   }else{
  //     const id = +this.route.snapshot.paramMap.get('subId');
  //     this.router.navigate([`/company/${this.companyId}/company-meeting/meeting/subject`]);
  //   }
  // }

  getUpperMeetingNote(noteId) {
    let subjectId;
    this.meetingService.getSubjectNote(noteId).subscribe(
      res => {
        subjectId = res.subject.id;
        if (this.companyId > 0) {
          this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject/${subjectId}/note/${noteId}`);
        } else if (this.companyId == 0) {
          this.router.navigateByUrl(`/personal-meeting/meeting/subject/${subjectId}/note/${noteId}`);          
        }
      }
    );
  }

  showUpperMeetingNote(noteId) {
    let subjectId;
    this.meetingService.getSubjectNote(noteId).subscribe(
      res => {
        subjectId = res.subject.id;
        this.meetingService.getSubject(subjectId).subscribe(
          res => {
            this.prevNoteUserList = res.share.with;
            this.prevNoteUserList.push(res.created.by);
            console.log(this.prevNoteUserList);
            for (let i=0; i<this.prevNoteUserList.length; i++) {
              if (this.currentUser.id == this.prevNoteUserList[i].id) {
                this.upperNoteFlag = true;
                break;
              }
            }
          },
          err => {}
        );
      }
    );
  }

  assignNote(noteId) {
    if (this.companyId > 0) {
      this.router.navigate([`/company/${this.companyId}/company-meeting/meeting/subject/${this.subject.id}/assignNote`, {assignNoteId: noteId}]);
    } else if (this.companyId == 0) {
      this.router.navigate([`/personal-meeting/meeting/subject/${this.subject.id}/assignNote`, {assignNoteId: noteId}]);      
    }
  }

  onReceivedFormData(fd){
    this.meetingService.addAttachment(this.subject.id, fd).subscribe(
        (res) => {
            this.isLoading = false;
            console.log(res);
            this.getSubject();
        },
        err => {
          console.log("upload attachment error");
        }
    )
  }

  // openAddNoteDialog() {
  //   const dialogRef = this.dialog.open(PSDialogComponent, {
  //     width: '700px',
  //     data: {
  //       subject_id: this.subject.id,
  //       company_id: this.companyId
  //     }
  //   });
  // }
}
