// right now, not using this component

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';
import { AuthService } from 'app/core/services/auth.service';
import { DialogService } from 'app/core/services/dialog.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';
import { CommonService } from 'app/core/services/common.service';

@Component({
  selector: 'add-approval',
  templateUrl: './add-approval.component.html',
  styleUrls: ['./add-approval.component.scss']
})
export class AddApprovalComponent implements OnInit {

  currentLoginCompanyId;
  statusId;
  isLoading;
  status;

  // check whether the logined user is the owner of the project
  // if so, can edit complete
  // elsewise, cannot edit complete
  isOwner: boolean = false;

  addReplyForm;
  saveOnce: Boolean = true;
  imgsMap = new Map<number, string>();
  selectedImgIndex : number;
  selectedFile = null;
  processedFile = null;
  
  modalOpen = false;
  
  selects = ['Approve', 'Denied'];
  placeholder = "Request Approve";
  default = "Approve";
  projectId;
  selectedUserList;
  messageContent = "has been approved!";
  currentProcessStatus;
  currentProcessFlag : boolean = false;
  emailAlreadySent : boolean = false;
  messageAlreadySent : boolean = false;
  sendEmailCheck:boolean= false;
  sendMessageCheck:boolean = false;
  
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
    private departmentOpportunityService: DepartmentOpportunityService,   
    private commonService: CommonService,
    
    
  ) {
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    this.statusId = this.route.snapshot.paramMap.get('oppoStatusId');
    this.projectId = this.route.snapshot.paramMap.get('oppoProjectId');
    this.currentProcessStatus = this.route.snapshot.queryParams['current_process_status'];

    this.isLoading = true;
    this.getStatus();
    this.createAddReplyForm();    
    this.getProductProjectCurrProcessWorkUsers();

   }

  ngOnInit() {

    // add listener to the save button in the header tool bar
    setTimeout(() => {
        const buttonClick = document.getElementById('header-submit-edit');
        buttonClick.addEventListener('click', () => {
            if (!this.addReplyForm.invalid && this.currentProcessFlag) {
                this.onSave();
            } else {
                let message = "Please fill all fields!";                    
                this.dialogService.openAlertDialog(message);
            }
        });
    }, 0);
  }

  getProductProjectCurrProcessWorkUsers() {
      this.departmentOpportunityService.getProductProjectCurrProcessWorkUsers(this.currentLoginCompanyId, this.projectId).subscribe(
          res => {
            this.selectedUserList = res;
          }
      )
  }

  getStatus() {
    this.businessMeetingService.getStatus(this.currentLoginCompanyId, this.statusId).subscribe(
      res => {
        this.status = res;
        this.isLoading = false;

        this.messageContent = 'Your work about ' + this.status.project.name + ' has been approved';

      }
    )
  }

  createAddReplyForm() {
    this.addReplyForm = this.fb.group({
        body: this.fb.array([
            this.initSubNote()
        ])
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
      if (this.addReplyForm.valid && this.saveOnce) {
          this.isLoading = true;
          this.saveOnce = false;
          this.setImgInfoToFormData();

          // replace \n using <br>, editted by yali
          let body;
          body = this.addReplyForm.value.body.map(this.replaceLinbeBreak);

          // convert to string
          body = JSON.stringify(body);

          var request = {
              'company_meeting_status_id' : this.statusId,
              'body' : body
          };
          this.departmentOpportunityService.addReply(this.currentLoginCompanyId, request).subscribe(
              res => {

                  let request = {
                      'current_process_status' : this.currentProcessStatus,
                  };
                  this.departmentOpportunityService.editProjectProcessStatus(this.currentLoginCompanyId, this.projectId, request).subscribe(
                      res => {
                        this.isLoading = false;

                        // send email or message                      
                        this.sendEmailtoUser();
                        this.sendMessgaeToUser();
                        
                      },
                      err => {
                        this.isLoading = false;
                        this.location.back();
                      }
                  )
              },
              err => {
                  this.isLoading = false;
                  this.location.back();
                  console.log("add reply error");
              }
          );
      }
  }

  setImgInfoToFormData(){
      this.imgsMap.forEach((imgUrl, index) => {
          this.addReplyForm.value.body[index].img = imgUrl;
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
                this.isLoading = false;                    
                console.log('😢 Oh no!', err);
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
            this.isLoading = false;
            
              this.imgsMap.set(index, res.url);
          },
          (err) => {
            this.isLoading = false;
            
          }
      );
  }

  onAddMore(){   
      const control = <FormArray>this.addReplyForm.controls['body'];
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
      if(this.addReplyForm.controls.body['controls'].length > 1){
          const control = <FormArray>this.addReplyForm.controls['body'];
          control.removeAt(i);
          this.imgsMap.delete(i);
      }
  }

  selectedWorkUser(value) {
    
    if (value == 'Approved') {
        this.currentProcessStatus = 'Approved';
        this.messageContent = 'Your work about ' + this.status.project.name + ' has been approved.';
        this.currentProcessFlag = true;
    } else if (value == 'Denied') {
        this.currentProcessStatus = 'Denied';
        this.messageContent = 'Your work about ' + this.status.project.name + ' has been denied.';
        this.currentProcessFlag = true;
    }

  }

    sendEmailtoUser(){

        // get the email array from the selectedUserList, which is the current process work users of the project
        let tempEmailArr = [];        
        for (let i=0; i<this.selectedUserList.length; i++) {
            tempEmailArr.push(this.selectedUserList[i].email);
        }

        let EmailValue = {
            "emails": tempEmailArr,
            "content": this.messageContent,
            "subject": " You have a new message from your process",
        };
        this.commonService.sendBroadcastToCustomer(EmailValue).subscribe(
            res=>{

                this.emailAlreadySent = true;
                if (this.messageAlreadySent) {
                    this.location.back();
                }
            }
        )
    }

    sendMessgaeToUser(){

        for (let i=0; i<this.selectedUserList.length; i++) {
            if(this.selectedUserList[i].phone != null){
                // get the email array from the selectedUserList, which is the current process work users of the project                
                let tempPhoneArr = [];
                tempPhoneArr.push(this.selectedUserList[i].phone);
                let SMSValue;

                SMSValue = {
                    "phones":tempPhoneArr,
                    "content": this.messageContent,
                }
                                
                this.commonService.sendInviteNoticeToUSer(SMSValue).subscribe(
                    res=>{
                        
                        this.messageAlreadySent = true;
                        if (this.emailAlreadySent) {
                            this.location.back();
                        }

                    }
                )           
            } else {
                let message = this.selectedUserList[i].first_name + ' ' + this.selectedUserList[i].last_name + " does not save phone number in OrcaSmart, so we cannot send text message to this user!";
                this.dialogService.openAlertDialog(message).subscribe(
                    res => {
                        console.log("no phone num");
                        this.location.back();
                    }
                )
            }
        }
    }
    // end

}
