import { Component, OnInit, ViewChild, Pipe } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { MeetingService } from 'app/core/services/meeting.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { DialogService } from 'app/core/services/dialog.service';
import { LoggingUserService } from 'app/core/services/logging-user.service';
import { AuthService } from 'app/core/services/auth.service';
import { RichText } from 'app/core/models/index';

@Component({
    selector: 'subject-note',
    templateUrl: './subject-note.component.html',
    styleUrls: ['./subject-note.component.scss']
})

export class SubjectNoteComponent implements OnInit{

    //the note of this component
    subjectNote;
    isLoading = false;
    
    imgSrc = '';
    //for checking whether this subject is shared
    isShared;
    projectModalOpen = false;
    commentModalOpen = false;
    replyModalOpen = false;

    companyId = 0;
    subjectId;
    // nextSubjectSharedUserList is the user list that next meeting subject is shared to
    nextSubjectSharedUserList;
    // UserListSentToNextSubject is the user list that will sent to next meeting subject when generate next new subject
    // include the created Author of current subject, and the shared user of current subject whose share type is "super_view"
    // element is id,id,id
    UserListSentToNextSubjectArr = [];
    UserListSentToNextSubjectStr;

    currentUser;
    newMeetingFlag: Boolean = false;
    leftTime;
    subNotes: RichText;
    commentsArr = [];
    unreadDiscussion = 0;
    discussion;
    discussionLength = 0;
    DiscussionFlag: Boolean = false;
    Attachment;

    @ViewChild('nameInput') nameInput;

    constructor(
        private router:Router,
        private route: ActivatedRoute,
        private location : Location,
        private meetingService: MeetingService,
        private dialogService: DialogService,
        private toasterService: ToasterService,
        private loggingUserService: LoggingUserService,
        private authService: AuthService
    ){
        console.log(this.route);
        this.subjectId = +this.route.snapshot.paramMap.get('subId');
        this.companyId = +localStorage.getItem("currentLoginCompanyId");
        console.log(this.companyId + '-----------'+this.subjectId );
    }

    ngOnInit(){
        this.getSubjectNote();

        setTimeout(() => {
            const buttonClick = document.getElementById('header-cancel');
            buttonClick.addEventListener('click', () => {
                this.isLoading = true;
                console.log("on cancel");
                // this.onCancel();
            });
        }, 0);
        
        // after 30s, delete the unread comment and reply records
        setTimeout(() => {
            this.meetingService.deleteUnreadComment(this.companyId, this.subjectNote.id).subscribe(res=>{
                console.log("delete unread comment");
                this.isLoading = false;
            });
        }, 2000);
    }

    onReceivedFormData(fd){
        this.meetingService.addMeetingNoteAttachment(this.subjectNote.id, fd).subscribe(
            (res) => {
                this.isLoading = false;
                console.log(res);
                this.getSubjectNote();
            },
            err => {
              console.log("upload attachment error");
            }
        )
      }

    getLeftTime(value) {
        let startDate = new Date();
        let endDate = new Date(value);
        let newEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59);
        console.log(startDate);
        console.log(newEndDate);
        let diffTime = Math.abs(newEndDate.getTime() - startDate.getTime());
        this.leftTime = Math.ceil(diffTime / (1000*60*60*24));
        console.log(this.leftTime);
      }
    
    getSubjectNote() {
        const user = this.loggingUserService.user;
        const noteId = +this.route.snapshot.paramMap.get('noteId');
        this.isLoading = true;

        // every time when getSubjectNode (reload the page), first clear the commentsArr to avoid repeat.
        this.commentsArr.splice(0, this.commentsArr.length);
        this.meetingService.getSubjectNote(noteId).subscribe(
            res => {
                console.log(res);
                this.subjectNote = res;
                console.log(this.subjectNote);
                if (this.subjectNote.type == 'project') {
                    this.subNotes = JSON.parse(this.subjectNote.body);                    
                }

                for (let i=0; i<this.subjectNote.comments.length; i++) {
                    this.subjectNote.comments[i].body = JSON.parse(this.subjectNote.comments[i].body);
                    for (let j=0; j<this.subjectNote.comments[i].replies.length; j++) {
                        this.subjectNote.comments[i].replies[j].body = JSON.parse(this.subjectNote.comments[i].replies[j].body);
                    }
                    if (this.subjectNote.comments[i].type == "discussion") {
                        this.discussionLength++;
                        if (!this.DiscussionFlag) {
                            this.discussion = this.subjectNote.comments[i];
                            this.DiscussionFlag = true;
                        }                          
                        
                        this.unreadDiscussion += this.subjectNote.comments[i].unread_records.length;

                        console.log(this.unreadDiscussion);                                                            
                        // this.subjectNote.comments.splice(i, 1);
                    } else if (this.subjectNote.comments[i].type == "comment") {                       
                        this.commentsArr.push(this.subjectNote.comments[i]);
                    } else if (this.subjectNote.comments[i].type == "all") {
                        this.commentsArr.push(this.subjectNote.comments[i]);                       
                    }
                }

                this.isShared = user.id !== res.created.by.id;
                this.isLoading = false;

                // setTimeout(() => {
                //     this.nameInput.nativeElement.addEventListener('click', e => {
                //         if (e.target && e.target.nodeName === 'IMG' ) {
                //         this.imgSrc = e.target.currentSrc;
                //         this.modalOpen = true;
                //         }
                //     });
                // },0);

                // get owner list
                if (this.subjectNote.owner != null) {
                    let ownerId = this.subjectNote.owner;
                    let ownerIdArr = ownerId.split(",");
                    let tempOwnerArr = [];
                    for (let j=0; j<ownerIdArr.length; j++) {
                        this.meetingService.getSpecificUser(ownerIdArr[j], 'id').subscribe(
                            res => {
                            tempOwnerArr.push(res.data[0]);
                            }
                        );
                    }
                    this.subjectNote.owner = tempOwnerArr;
                }

                //get shared user from next meeting subject
                console.log(this.subjectNote.next_meeting_subject);
                if (this.subjectNote.next_meeting_subject != null) {
                    this.meetingService.getSubject(this.subjectNote.next_meeting_subject).subscribe(
                        res => {
                            console.log(res);
                            this.nextSubjectSharedUserList = res.share.with;
                            console.log(this.nextSubjectSharedUserList);
                        }
                    );
                    
                }

                // getCurrentUser, check whether the user is the originator of the meeting subject                
                this.authService.getCurrentUser().subscribe(
                    res => {
                        this.currentUser = res.user;
                        console.log(this.currentUser.id);
                        console.log(this.subjectNote.owner);
                        if (this.subjectNote.owner != null) {
                            for (let i=0; i<this.subjectNote.owner.length; i++) {
                                if (this.currentUser.id == this.subjectNote.owner[i].id) {
                                    this.newMeetingFlag = true;
                                    console.log(this.newMeetingFlag);
                                    break;
                                }
                            }
                        }
                    },
                    err => {
                        console.log("get curent user bug!");
                    }
                    );

                // get left time of the project
                this.getLeftTime(this.subjectNote.require_date);
            }
                
        );
        console.log(noteId);
        if(noteId){
            this.meetingService.deleteUnreadNote(this.companyId, noteId).subscribe(res=>{console.log("delete unread note")});
                        
        }
    }

    deleteComment(id){
        this.dialogService.openDialog().subscribe(result => {
            if (result) {
                this.isLoading = true;
                this.meetingService.deleteComment(id).subscribe(() =>{
                    this.toasterService.showToaster('Deleted', '', 3000);
                    const idx = this.subjectNote.comments.findIndex(x =>x.id ===id);
                    if (idx > -1) {
                        this.subjectNote.comments.splice(idx, 1);
                    }
                    this.isLoading = false;
                })
            }
            
        })
    }

 // close the image modal
 closeModal(){
    this.projectModalOpen = false;
    this.commentModalOpen = false;
    this.replyModalOpen = false;
  }

  openProjectModal(){
    this.projectModalOpen = true;
  }

  openCommentModal(){
    this.commentModalOpen = true;
  }

  openReplyModal(){
    this.replyModalOpen = true;
  }
    
    // onCancel() {
    //     const id = +this.route.snapshot.paramMap.get('noteId');
    //     this.isLoading = true;
    //     this.meetingService.deleteUnreadComment(id).subscribe(res=>{
    //         this.router.navigate([`/company/${this.companyId}/company-meeting/meeting/subject/${this.subjectNote.subject.id}`], { skipLocationChange: true });
    //         this.isLoading = false;
    //     })        
    // }

    generateNextSubject() {
        // get UserListSentToNextSubject
        this.UserListSentToNextSubjectArr.push(this.subjectNote.created.by.id);
        this.meetingService.getSharedUserListByType(this.subjectNote.subject.id, "super_view").subscribe(
            res => {
                for (let i=0; i<res.length; i++) {
                    this.UserListSentToNextSubjectArr.push(res[i].shared_to);
                }
                
                // this.UserListSentToNextSubjectArr.toString();
                this.UserListSentToNextSubjectStr = this.UserListSentToNextSubjectArr.join(",");
                console.log(this.UserListSentToNextSubjectStr);
                if (this.companyId > 0) {
                    this.router.navigate([`/company/${this.companyId}/company-meeting/meeting/create`, {sharedUser: this.UserListSentToNextSubjectStr, prevNoteId: this.subjectNote.id}]);
                } else if (this.companyId == 0) {
                    this.router.navigate([`/personal-meeting/meeting/create`, {sharedUser: this.UserListSentToNextSubjectStr, prevNoteId: this.subjectNote.id}]);                    
                }
            }
        );
    }

    addComment() {
        if (this.companyId == 0) {
          this.router.navigate([`/personal-meeting/meeting/subject/${this.subjectNote.subject.id}/note/${this.subjectNote.id}/comment/create/${this.subjectNote.id}`, {type: 'comment'}]);
        } else if (this.companyId > 0) {
          this.router.navigate([`/company/${this.companyId}/company-meeting/meeting/subject/${this.subjectNote.subject.id}/note/${this.subjectNote.id}/comment/create/${this.subjectNote.id}`, {type: 'comment'}]);       
        }
    }

    addDiscussion() {
        if (this.companyId == 0) {
            this.router.navigate([`/personal-meeting/meeting/subject/${this.subjectNote.subject.id}/note/${this.subjectNote.id}/comment/create/${this.subjectNote.id}`, {type: 'all'}]);
        } else if (this.companyId > 0) {
        this.router.navigate([`/company/${this.companyId}/company-meeting/meeting/subject/${this.subjectNote.subject.id}/note/${this.subjectNote.id}/comment/create/${this.subjectNote.id}`, {type: 'all'}]);       
        }
    }

    deleteSubjectNote(){
        //console.log(this.subjectNote.id);
        this.dialogService.openDialog().subscribe(result => {
            this.meetingService.deleteNote(this.subjectNote.id).subscribe(
                res=>{
                    this.location.back();
                }
            )
        })
        
    }
    
}