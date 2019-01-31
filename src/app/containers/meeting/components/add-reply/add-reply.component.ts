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
import { CommonService } from 'app/core/services/common.service';

@Component({
  selector: 'app-add-reply',
  templateUrl: './add-reply.component.html',
  styleUrls: ['./add-reply.component.scss']
})
export class AddReplyComponent implements OnInit {

  //form for add new comment for a note
  // commentForm: FormGroup;

  isLoading: Boolean = false;
  saveOnce: Boolean = true;

  //check whether it is uploading images
  isUploadingImg = false;

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
  isOwner: boolean = false;
  type;
  emailList=[];
  sendEmialSubjectName;

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
      private commonService : CommonService
      
  ){
      this.noteId = +this.route.snapshot.paramMap.get('noteId');
      this.commentId = +this.route.snapshot.paramMap.get('comId');
      this.subjectId = +this.route.snapshot.paramMap.get('subId');
      this.type = this.route.snapshot.paramMap.get('type');

      this.companyId = +localStorage.getItem("currentLoginCompanyId");
      this.sharedOrNot =localStorage.getItem('meeting_key_switch');
      
      // this.createForm();
      this.isLoading = true;

      this.createAddCommentForm();
  }

  ngOnInit(){
    this.getComment();
    this.getCurrentUser()
    //add listener to the save button in the header toolbar
    setTimeout(() => {
        const buttonClick = document.getElementById('header-submit-edit');
        buttonClick.addEventListener('click', () => {
            if (!this.addCommentForm.invalid) {
                this.onSave();
            } else {
                let message = "Please fill all fields!";                
                this.dialogService.openAlertDialog(message);
            }
        });
    }, 0);     
      
  }

  getCurrentUser(){
    this.authService.getCurrentUser().subscribe(
        res => {
            this.currentUser = res.user;
            console.log(res.user);
        },
        err => {
            // console.log("get current user error");
        }
    )    
  }

  getComment() {
    this.meetingService.getComment(this.commentId).subscribe(res =>{
        console.log(res);
      this.noteComment = res;
      this.isLoading = false;
      this.getProjectRealtedUser();
      this.noteComment.body = JSON.parse(this.noteComment.body);
    },
    err =>{
      console.log(err); 
      this.isLoading = false;
    })        
    
  }

  getProjectRealtedUser(){
    this.emailList.push(this.noteComment.updated.by.email);
    this.meetingService.getSubjectNote(this.noteId).subscribe(
        res=>{
            this.sendEmialSubjectName = res.name;
            if(this.emailList.includes(res.created.by.email)){
                this.emailList.push(res.created.by.email);
            }
            
        }
    )
  }
  sendEmialToUsers(){
    let senderName = this.currentUser.first_name + this.currentUser.last_name;
    if(this.emailList.includes(this.currentUser.email)){
        this.emailList.splice(this.emailList.findIndex(e=>e == this.currentUser.email ),1);
    }
    let emailValue = {
        "emails": this.emailList,
        "content": senderName +  "replay you in project"+ "'" + this.sendEmialSubjectName+"'",
        "subject": this.sendEmialSubjectName ,
    }
    if(this.emailList.length !== 0){
        this.commonService.sendBroadcastToCustomer(emailValue).subscribe(
                res=>{

                }
            )
    }
   
}



  createAddCommentForm() {
      this.addCommentForm = this.fb.group({
          description: this.fb.array([
              this.initSubNote()
          ]),
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
          this.isLoading = true;
          this.saveOnce = false;
          this.setImgInfoToFormData();
          this.addCommentForm.value.description = JSON.stringify(this.addCommentForm.value.description);
          var request;
          request = {
            'comment_id':this.noteComment.id, 
            'body': this.addCommentForm.value.description, 
            'company_id' : this.companyId            
          };

          console.log(request);
          this.meetingService.addReply(request).subscribe(
              res => {
                  this.location.back();
                // sned emial function
                //   this.sendEmialToUsers();
              },
              err => {
                  console.log("add reply error");
              }
          );

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
    
