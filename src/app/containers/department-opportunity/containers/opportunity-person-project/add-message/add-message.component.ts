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
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';

@Component({
  selector: 'add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.scss']
})
export class AddMessageComponent implements OnInit {

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

  selects = ['Request Approve', 'Next Step'];
  placeholder = "Request Approve";
  default = "Request Approve";
  sendEmailCheck:boolean= false;
  sendMessageCheck:boolean = false;
  checkEmailandMessage:boolean = false;
  messageContent = null;
  selectedUserList = new Set();
  selectedUserEmailList = new Set();
  processUserList;
  chooseApproval : boolean = false;
  chooseNextProcess : boolean = false;
  waitingApproval : boolean = false;
  currentProcessId;
  projectAttachment;
  fdAttachment = new FormData();  

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
    private departmentOpportunityService: DepartmentOpportunityService,   
      
  ) {
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    this.projectId = this.route.snapshot.paramMap.get('oppoProjectId');
    this.sharedOrNot =localStorage.getItem('meeting_key_switch');
    this.currentProcessId = this.route.snapshot.queryParams['currentProcessId'];

    this.isLoading = true;
    // this.getBriefProject();
    this.getProductProjectOpportunityWithProcess();
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

  getProductProjectOpportunityWithProcess() {
    this.departmentOpportunityService.getProductProjectOpportunityWithProcess(this.currentLoginCompanyId, this.projectId).subscribe(
        res => {
            this.briefProject = res;

            this.isLoading = false;
        }
    )
  }

  createAddStatusForm() {
    this.addStatusForm = this.fb.group({
        body: this.fb.array([
            this.initSubNote()
        ]),
        // complete : ['']
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
        
        let tempProcessId;
        // if current process id is not 0, we will save the process id to the status
        // else if the current process is 0, we will save the current process id of the project to the status
        if (this.currentProcessId == 0) {
            tempProcessId = this.briefProject.current_process.id;
        } else if (this.currentProcessId != 0) {
            tempProcessId = this.currentProcessId;
        }

        console.log(body);

        var request = {
            'company_meeting_project_id' : this.projectId,
            'body' : body,
            'type' : 'comment',
            'process_id' : tempProcessId,
            //   'complete' : this.addStatusForm.value.complete
        };
        this.departmentOpportunityService.addStatus(this.currentLoginCompanyId, request).subscribe(
            res => {
                this.isLoading = false;      
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

        let fileType = this.selectedFile.type;
        
        let fileTypeArr = fileType.split('/');
        
        // resize the image, set width to 600, and height resized accordingly to keep the aspect ratio the same. editted by yali
        if (fileTypeArr[0] == "image") {
            // if the file is image, resize the image, and then upload to back-end
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
        } else {
            // if the file is pdf, word, or excel instead of image, directly upload it to back-end
            this.processedFile = this.selectedFile;            
            this.onAddImg(index);  
        }
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

    // select approve or next step
    onGetSelect(value) {
    
        // request approve
        if (value.status == this.selects[0]) {
        } 
        // go to next step
        else if (value.status == this.selects[1]) {
          
        }
    }

    // getProcess() {
    //     this.departmentOpportunityService.getProcess(this.currentLoginCompanyId, this.p)
    // }

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
            "subject": " You have a new message from the opportunity   "+ "'" + "'",
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
                        "content":" You have a new message from the opportunity "+ "'"  + "'" + ". " + "Please login in http://bips.orcasmart.us to check!",
                    }
                } else {
                    SMSValue = {
                        "phones":tempPhoneArr,
                        "content":" You have a new message from the opportunity "+ "'"  + "'" + ". " + this.messageContent + ". " + "Please login in http://bips.orcasmart.us to check!",
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

}
