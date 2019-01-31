import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MeetingService } from 'app/core/services/meeting.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute,ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';
import { AuthService } from 'app/core/services/auth.service';
import { DialogService } from 'app/core/services/dialog.service';
import { StoreState } from 'app/core/models';
import { Store } from '@ngrx/store';
import { CommonService } from 'app/core/services/common.service';

@Component({
    selector:'add-comment',
    templateUrl:'add-comment.component.html',
    styleUrls:['add-comment.component.scss']
})

export class AddCommentComponent implements OnInit{
    //form for add new comment for a note
    // commentForm: FormGroup;

    isLoading: Boolean = false;
    saveOnce: Boolean = true;

    //check whether it is uploading images
    isUploadingImg = false;

    isReply;
    
    subjectNote:any;

    noteComment:any;
    //current note id 
    noteId;
    commentId;
    subjectId;
    companyId;
    //replied to someone
    replied_to_id:number = 0;

    sharedOrNot;

    // add comment
    addCommentForm: FormGroup;
    imgsMap = new Map<number, string>();
    selectedImgIndex : number;
    selectedFile = null;
    modalOpen = false;

    currentUser;
    currentUserName;
    isOwner: boolean = false;
    type;
    emailList=[];
    sendEmialSubjectName;
    nextMeetingId;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private location: Location,
        private route: ActivatedRoute,
        private imageService: ImageService,
        private meetingService: MeetingService,
        private toasterService: ToasterService,
        private authService: AuthService,
        private dialogService: DialogService,
        private store: Store<StoreState>,
        private commonService: CommonService
        
    ){
        this.noteId = +this.route.snapshot.paramMap.get('noteId');
        this.commentId = +this.route.snapshot.paramMap.get('comId');
        this.subjectId = +this.route.snapshot.paramMap.get('subId');
        console.log(this.subjectId );
        console.log(this.commentId);
        this.type = this.route.snapshot.paramMap.get('type');
        console.log(this.type);
        // console.log(this.type);
        

        this.companyId = +localStorage.getItem("currentLoginCompanyId");
        this.sharedOrNot =localStorage.getItem('meeting_key_switch');
       
        this.isReply = this.route.routeConfig.path;
        // this.createForm();
        this.isLoading = true;
        this.createAddCommentForm();
    }

    ngOnInit(){
        //add listener to the save button in the header toolbar
        setTimeout(() => {
            const buttonClick = document.getElementById('header-submit-edit');
            buttonClick.addEventListener('click', () => {
                // sometimes both noteForm.invalid and noteForm.valid are false;
                // if (!this.commentForm.invalid && !this.isUploadingImg) {
                //     this.onSave();
                // }

                if (!this.addCommentForm.invalid) {
                    this.onSave();
                } else {
                    let message = "Please fill all fields!";                    
                    this.dialogService.openAlertDialog(message);
                }
            });
        }, 0);

        if(this.isReply === "subject/:subId/note/:noteId/comment/create/:noteId" || this.isReply === "subject_shared/:subId/note/:noteId/comment/create/:noteId"){
            this.meetingService.getSubjectNote(this.noteId).subscribe(res => {
                this.subjectNote = res;
                this.nextMeetingId = +res.next_meeting_subject;
                if(this.type == 'all'){
                    this.getAllInviteUsersAndSubjectName();
                }else if(this.type=="discussion"){
                    this.getSubjectUserAndSubjectName();
                }else if(this.type=="comment"){
                    this.getComnentRelatedUserAndSubjectName();
                }
                this.isLoading = false;

                // getCurrentUser, check whether the user is the owner of the project
                this.authService.getCurrentUser().subscribe(
                    res => {
                        this.currentUser = res.user;
                        if (this.subjectNote.owner != null) {
                            let ownerArr = this.subjectNote.owner.split(",");
                            // console.log(ownerArr);
                            for (let i=0; i<ownerArr.length; i++) {
                                if (this.currentUser.id == ownerArr[i]) {
                                    this.isOwner = true;
                                    break;
                                }
                            }
                        }
                    },
                    err => {
                        // console.log("get current user error");
                    }
                )               

            }, err =>{console.log(err); this.isLoading = false;})
        }else{
            this.meetingService.getComment(this.commentId).subscribe(res =>{
                this.noteComment = res;
                this.replied_to_id = this.noteComment.created.by.id;
                this.isLoading = false;
            }, err =>{console.log(err); this.isLoading = false;})
        }
    }

    getAllInviteUsersAndSubjectName(){
        this.meetingService.getSubject(this.subjectId ).subscribe(
            res=>{
                this.sendEmialSubjectName = res.name;
                this.emailList.push(res.share.by.email);
                let sharedUserList = res.share.with;
                for(var i =0; i<sharedUserList.length; i++){
                    if(!this.emailList.includes(sharedUserList[i].email)){
                        this.emailList.push(sharedUserList[i].email)
                    }
                }
            }
        )
    }

    getSubjectUserAndSubjectName(){
        this.meetingService.getSubjectNote(this.noteId).subscribe(
            res=>{
                this.sendEmialSubjectName = res.name;
                this.emailList.push(res.created.by.email);
                let userComments = res.comments;
                for(var i = 0; i< userComments.length; i++){
                    if(!this.emailList.includes(userComments[i].created.by.email)){
                        this.emailList.push(userComments[i].created.by.email)
                    }
                }
            }
        )
    }

    getComnentRelatedUserAndSubjectName(){
        if (this.nextMeetingId != 0) {
            this.meetingService.getSubject(this.nextMeetingId).subscribe(
                res=>{
                    this.sendEmialSubjectName = res.name;
                    console.log(res);
                    this.emailList.push(res.created.by.email);
                    let sharedUserList = res.share.with;
                    for(var i = 0; i<sharedUserList.length; i++){
                        if(!this.emailList.includes(sharedUserList[i].email)){
                            this.emailList.push(sharedUserList[i].email)
                        }
                    }
                });
        }           
    }

    createAddCommentForm() {
        this.addCommentForm = this.fb.group({
            description: this.fb.array([
                this.initSubNote()
            ]),
            complete: ['']
        });
    }

    initSubNote() {
        return this.fb.group({
            img: [''],
            text: ['']
        })
    }

    ngOnDestroy(){
        const old_element = document.getElementById("header-submit-edit");
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
    }

    onSave() {
        if (this.addCommentForm.valid && this.saveOnce) {
            this.saveOnce = false;
            this.isLoading = true;
            this.setImgInfoToFormData();
            this.addCommentForm.value.description = JSON.stringify(this.addCommentForm.value.description);
            var request;
            if (this.addCommentForm.value.complete == "") {
                request = {
                    'note_id':this.noteId, 
                    'body': this.addCommentForm.value.description, 
                    'type' : this.type,
                    'company_id' : this.companyId                    
                };
            } else {
                request = {
                    'note_id':this.noteId, 
                    'body': this.addCommentForm.value.description, 
                    'type' : this.type,
                    'complete' : this.addCommentForm.value.complete,
                    'company_id' : this.companyId                    
                };
            }
            
            // console.log(request);
            this.meetingService.addComment(request).subscribe(
                res => {
                    this.location.back();
                },
                err => {
                    console.log("add comment error");
                }
            );

        };
        // send email function
        // this.sendEmialToUsers();
    }

    sendEmialToUsers(){
        let senderName = this.currentUser.first_name + this.currentUser.last_name;
        if(this.emailList.includes(this.currentUser.email)){
            this.emailList.splice(this.emailList.findIndex(e=>e == this.currentUser.email ),1);
        }
        let emailValue = {
            "emails": this.emailList,
            "content": senderName + " update a new status in "+ "'" + this.sendEmialSubjectName+"'",
            "subject": this.sendEmialSubjectName ,
        }
        // console.log(emailValue);
        if(this.emailList.length !==0){
            this.commonService.sendBroadcastToCustomer(emailValue).subscribe(
                res=>{
    
                }
            )
        }
        
    }

    setImgInfoToFormData(){
        this.imgsMap.forEach((imgUrl, index) => {
          this.addCommentForm.value.description[index].img = imgUrl;
        });
    }

    onFileSelected(event, index){
        if(event.target.files[0]){
            this.selectedImgIndex = index;
            this.selectedFile = <File>event.target.files[0];
            this.onAddImg(index);
        }
    }

    onAddImg(index){
        const fd = new FormData();
        fd.append('image', this.selectedFile, this.selectedFile.name);

        this.imageService.uploadImage(fd).subscribe(
            (res) => {
                // this.noteForm.value.description[index].img = res.url;
                this.imgsMap.set(index, res.url);
            },
            (err) => {
            }
        );
    }

    onAddMore(){   
        const control = <FormArray>this.addCommentForm.controls['description'];
        control.push(this.initSubNote());
    }

    getImg(i){
        let res = this.imgsMap.get(i);
        return res;
    }

    openModal(){
        this.modalOpen =true;
    } 

    closeModal(){
        this.modalOpen =false;
    }

    onDelete(i){
        if(this.addCommentForm.controls.description['controls'].length > 1){
            const control = <FormArray>this.addCommentForm.controls['description'];
            control.removeAt(i);
            this.imgsMap.delete(i);
        }
    }
    
}




// **************************************************************************************
// folowing code is used to add subject using editor, not used at this time
// ***************************************************************************************
//     createForm() {
//         this.commentForm= this.fb.group({
//             note_id:[''],
//             body:[''],
//             replied_to_id:['']
//          })
//     }

//     onSave(){
//         const body = document.getElementById('quill').children[1].children[0].innerHTML;
//         const newBody = this.changeBody(body);
//         if(this.isReply === "subject/:subId/note/:noteId/comment/create/:noteId"){
//             this.meetingService.addComment({'note_id':this.noteId, 'body': newBody, 'company_id' : this.companyId}).subscribe(res => {
//                 if (this.companyId) {
//                     this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject/${this.subjectId}/note/${this.noteId}`).then(() => {
//                         this.toasterService.showToaster('Created Successfully!', '',3000);
//                     });
//                 } else if (this.companyId == 0) {
//                     this.router.navigateByUrl(`/personal-meeting/meeting/subject/${this.subjectId}/note/${this.noteId}`).then(() => {
//                         this.toasterService.showToaster('Created Successfully!', '',3000);
//                     });
//                 }
//             });
           
//         } else if(this.isReply === "subject_shared/:subId/note/:noteId/comment/create/:noteId"){
//             this.meetingService.addComment({'note_id':this.noteId, 'body': newBody, 'company_id' : this.companyId}).subscribe(res => {
//                 if (this.companyId > 0) {
//                     this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject_shared/${this.subjectId}/note/${this.noteId}`).then(() => {
//                         this.toasterService.showToaster('Created Successfully!', '',3000);
//                     });
//                 } else if (this.companyId == 0) {
//                     this.router.navigateByUrl(`/personal-meeting/meeting/subject_shared/${this.subjectId}/note/${this.noteId}`).then(() => {
//                         this.toasterService.showToaster('Created Successfully!', '',3000);
//                     });
//                 }
//             });
//         } else {
//             this.meetingService.addComment({'note_id':this.noteComment.note.id, 'body': newBody, 'replied_to_id':this.replied_to_id, 'company_id': this.companyId}).subscribe(res => {
//                 if (this.sharedOrNot == 'myMeeting') {
//                     if (this.companyId > 0) {
//                         this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject/${this.subjectId}/note/${this.noteId}`).then(() => {
//                             this.toasterService.showToaster('Created Successfully!', '',3000);
//                         });
//                     } else if (this.companyId == 0) {
//                         this.router.navigateByUrl(`/personal-meeting/meeting/subject/${this.subjectId}/note/${this.noteId}`).then(() => {
//                             this.toasterService.showToaster('Created Successfully!', '',3000);
//                         });
//                     }
//                 } else if (this.sharedOrNot == 'sharedMeeting') {
//                     if (this.companyId > 0) {
//                         this.router.navigateByUrl(`/company/${this.companyId}/company-meeting/meeting/subject_shared/${this.subjectId}/note/${this.noteId}`).then(() => {
//                             this.toasterService.showToaster('Created Successfully!', '',3000);
//                         });
//                     } else if (this.companyId == 0) {
//                         this.router.navigateByUrl(`/personal-meeting/meeting/subject_shared/${this.subjectId}/note/${this.noteId}`).then(() => {
//                             this.toasterService.showToaster('Created Successfully!', '',3000);
//                         });
//                     }
                    
//                 }
//             })
//         }
//     }

//     //change the html of the note body when saving
//     changeBody(body: string) {
//         return body.replace(/<p><img .+? src=".+?"><\/p>(<p>.*?<\/p>){6,6}/g, x => `<div class="picture">` + x + `</div>`);
//     }

//     // Cancel the editing
//     onCancel() {
//         this.location.back();
//     }

//      // runs every time quill's content changes
//      logChange($event: any) {
//         const ops = $event.delta.ops;
//         // if insert an image, then change the html to float it to the left and add six paragraph on the right
//         // then upload the image and change the src value.
//         if (ops[ops.length - 1].insert && ops[ops.length - 1].insert.image) {
//           const url = ops[ops.length - 1].insert.image;
//           const formData = this.imageService.urltoFormData(url);
//           let html = document.querySelector('.ql-editor').innerHTML;
//           html = html.replace(/<img src=".+?">/g, x => x.substring(0, 5) + 'alt="no image" align="left" width="50" height="54" '
//                     + x.substring(5)) + '<p></p><p></p><p></p>';
//           document.getElementById('quill').children[1].children[0].innerHTML = html;
//           // upload the img and replace its src
//           this.isUploadingImg = true;
//           this.imageService.uploadImage(formData)
//           .subscribe(data => {
//             const html1 = document.getElementById('quill').children[1].children[0].innerHTML.replace(url,
//             data.url);
//             document.getElementById('quill').children[1].children[0].innerHTML = html1;
//             this.isUploadingImg = false;
//           }, err => {
//               console.log('-----------------------error--------------------');
//               console.log(err);
//               this.isUploadingImg = false;
//           });
//         }
//     }

// }
