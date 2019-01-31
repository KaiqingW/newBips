import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute,ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';
import { AuthService } from 'app/core/services/auth.service';
import { DialogService } from 'app/core/services/dialog.service';
import { concat } from 'rxjs/observable/concat';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { CommonService } from 'app/core/services/common.service';

@Component({
  selector: 'add-status',
  templateUrl: './add-status.component.html',
  styleUrls: ['./add-status.component.scss']
})
export class AddStatusComponent implements OnInit {

  currentLoginCompanyId;
  projectId;
  isLoading;
  briefProject;

  // check whether the logined user is the owner of the project
  // if so, can edit complete
  // elsewise, cannot edit complete
  isOwner: boolean = false;

  sharedOrNot;
  addStatusForm;
  saveOnce: Boolean = true;
  imgsMap = new Map<number, string>();
  selectedImgIndex : number;
  selectedFile = null;
  processedFile = null;
  
  modalOpen = false;

  subjectId;
  meetingName;
  sharedUserList;
  sharedUserAdminList;
  createdUser;
  sendEmailCheck:boolean= false;
  sendMessageCheck:boolean = false;
  checkEmailandMessage:boolean = false;
  messageContent = null;
  selectedUserList = new Set();
  selectedUserEmailList = new Set();
  selectedUserPhoneList = new Set();
  projectOwners;
  subjectSharedAdminAndProjectOwners;

  constructor(
    private businessMeetingService: BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private imageService: ImageService,
    private authService: AuthService,
    private location: Location,
    private ng2ImgMax: Ng2ImgMaxService,
    private commonService: CommonService,
    
    
  ) {
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.sharedOrNot =localStorage.getItem('meeting_key_switch');
    this.subjectId = this.route.snapshot.paramMap.get('subjectId');
    
    this.isLoading = true;
    this.getBriefProject();
    this.createAddStatusForm();    
   }

  ngOnInit() {

    // add listener to the save button in the header tool bar
    setTimeout(() => {
        const buttonClick = document.getElementById('header-submit-edit');
        buttonClick.addEventListener('click', () => {
            if (!this.addStatusForm.invalid) {
                this.onSave();
            } else {
                let message = "Please fill all fields!";                    
                this.dialogService.openAlertDialog(message);
            }
        });
    }, 0);

    
  }

   // send email and text message
    // get meeting name for sent email and messge
    getMeetingName(){
        this.businessMeetingService.getSubject(this.currentLoginCompanyId, this.subjectId).subscribe(
            res=>{  
                this.meetingName = res.name;

                // get the shared user list of the subject
                this.sharedUserList = res.sharedWith;
                this.sharedUserAdminList = res.sharedWithAdmin;
                this.createdUser = res.created.by;
                this.isLoading = false;

                let tempSet = new Set();
                for (let i=0; i<this.sharedUserAdminList.length; i++) {
                    if (this.sharedUserAdminList[i].email != this.createdUser.email) {
                        tempSet.add(this.sharedUserAdminList[i]);
                        
                    }
                }
                for (let j=0; j<this.projectOwners.length; j++) {
                    if (this.projectOwners[j].email != this.createdUser.email) {
                    tempSet.add(this.projectOwners[j]);
                    
                    }
                }

                this.subjectSharedAdminAndProjectOwners = Array.from(tempSet);

            }
        )
    }

    selectUser(value) {
        if (this.selectedUserList.has(value)) {
            this.selectedUserList.delete(value);
        } else {
            this.selectedUserList.add(value);
        }

        if (this.selectedUserEmailList.has(value.email)) {
            this.selectedUserEmailList.delete(value.email);
        } else {
            this.selectedUserEmailList.add(value.email);
        }
        
        if (this.selectedUserPhoneList.has(value.phone)) {
            this.selectedUserPhoneList.delete(value.phone);
        } else {
            this.selectedUserPhoneList.add(value.phone);
        }
        
    }

    sendEmailtoUser(){
        //send email to invited user
       let tempSelectedUserEmailList = Array.from(this.selectedUserEmailList);
       let tempMessageContent;
       if (this.messageContent == null) {
            tempMessageContent = "No Specific Content";
       } else {
            tempMessageContent = this.messageContent;
       }
       
        let EmailValue = {
            "emails": tempSelectedUserEmailList,
            "content": tempMessageContent,
            "subject": " You have a new message from the meeting   "+ "'" + this.meetingName + "'",
        };
        this.commonService.sendBroadcastToCustomer(EmailValue).subscribe(
            res=>{
            }
        )
    }
    
    sendMessgaeToUser(){
    
        let tempSelectedUserList = Array.from(this.selectedUserList);
        for (let i=0; i<tempSelectedUserList.length; i++) {
            if(tempSelectedUserList[i].phone != null){
                let tempPhoneArr = [];
                tempPhoneArr.push(tempSelectedUserList[i].phone);
                let SMSValue;
                if (this.messageContent == null) {
                    SMSValue = {
                        "phones":tempPhoneArr,
                        "content":" You have a new message from the meeting "+ "'" + this.meetingName + "'" + ". " + "Please login in http://bips.orcasmart.us to check!",
                    }
                } else {
                    SMSValue = {
                        "phones":tempPhoneArr,
                        "content":" You have a new message from the meeting "+ "'" + this.meetingName + "'" + ". " + this.messageContent + ". " + "Please login in http://bips.orcasmart.us to check!",
                    }
                }
                
                this.commonService.sendInviteNoticeToUSer(SMSValue).subscribe(
                    res=>{
                    }
                )
            
            } else {
                let message = tempSelectedUserList[i] + " does not save phone number in OrcaSmart, so we cannot send text message to this user!";
                this.dialogService.openAlertDialog(message).subscribe(
                res => {
        
                }
                )
            }
        }
    }
    // end

  getBriefProject() {
    this.businessMeetingService.getBriefProject(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {
        this.briefProject = res;
        this.projectOwners = res.owners;
        
        this.isLoading = false;
        this.getCurrentUser();   
        this.getMeetingName();   
      }
    )
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(
      res => {
        // check whether the logined user is the owner of the project
        let user_id = res.user.id;
        for (let i=0; i<this.briefProject.owners.length; i++) {
          if (user_id == this.briefProject.owners[i].user_id) {
            this.isOwner = true;
            break;
          }
        }
      }
    )
  }

  createAddStatusForm() {
    this.addStatusForm = this.fb.group({
        body: this.fb.array([
            this.initSubNote()
        ]),
        complete : ['']
    });
  }

  initSubNote() {
      return this.fb.group({
          img: [''],
          text: ['']
      })
  }

    // replace \n using <br>, editted by yali
    replaceLinbeBreak(value) {
        value.text = value.text.replace(/(\n)+/g, '<br>')
        return value;
    }

  onSave() {
      if (this.addStatusForm.valid && this.saveOnce) {
          this.isLoading = true;
          this.saveOnce = false;
          this.setImgInfoToFormData();

          // replace \n using <br>, editted by yali
          let body;
          body = this.addStatusForm.value.body.map(this.replaceLinbeBreak);

          // convert to string
          body = JSON.stringify(body);
          
          var request = {
              'company_meeting_project_id' : this.projectId,
              'body' : body,
              'type' : 'status',
              'complete' : this.addStatusForm.value.complete
          };
          this.businessMeetingService.addStatus(this.currentLoginCompanyId, request).subscribe(
              res => {
                  this.isLoading = false;   
                  if (this.sendEmailCheck && this.sendMessageCheck) {
                    this.sendEmailtoUser();
                    this.sendMessgaeToUser();
                } else if (this.sendMessageCheck) {
                    this.sendMessgaeToUser();
                } else if (this.sendEmailCheck) {
                    this.sendEmailtoUser();
                }              
                  this.location.back();
              },
              err => {
                    this.isLoading = false;                
                  console.log("add status error");
              }
          );
      }
  }

  setImgInfoToFormData(){
      this.imgsMap.forEach((imgUrl, index) => {
          this.addStatusForm.value.body[index].img = imgUrl;
      });
  }

  onFileSelected(event, index){
      if(event.target.files[0]){
            this.isLoading = true;

          this.selectedImgIndex = index;
          this.selectedFile = <File>event.target.files[0];
          
          // resize the image, set width to 600, and height resized accordingly to keep the aspect ratio the same. editted by yali
          this.ng2ImgMax.resizeImage(this.selectedFile, 600, 10000).subscribe(
            (res) => {
                this.isLoading = false;
                this.processedFile = new File([res], res.name);
                
                this.onAddImg(index);             
            },
            (err) => {
                console.log('😢 Oh no!', err);
                this.isLoading = false;

                // show dialog if the user does not upload image
                let message = "Please only upload image here. If you need to upload pdf, doc or excel, please upload them at attachment part.";
                this.dialogService.openAlertDialog(message);
                
            }
        );
      }
  }

  onAddImg(index){
        this.isLoading = true;
      const fd = new FormData();
      fd.append('image', this.processedFile, this.processedFile.name);

      this.imageService.uploadImage(fd).subscribe(
          (res) => {
              this.imgsMap.set(index, res.url);
              this.isLoading = false;
          },
          (err) => {
            this.isLoading = false;
            
          }
      );
  }

  onAddMore(){   
      const control = <FormArray>this.addStatusForm.controls['body'];
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
      if(this.addStatusForm.controls.body['controls'].length > 1){
          const control = <FormArray>this.addStatusForm.controls['body'];
          control.removeAt(i);
          this.imgsMap.delete(i);
      }
  }

}
