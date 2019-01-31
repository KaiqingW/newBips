import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute,ParamMap, Params } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';
import { AuthService } from 'app/core/services/auth.service';
import { DialogService } from 'app/core/services/dialog.service';
import { concat } from 'rxjs/observable/concat';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { CommonService } from 'app/core/services/common.service';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';

@Component({
  selector: 'add-approve-deny',
  templateUrl: './add-approve-deny.component.html',
  styleUrls: ['./add-approve-deny.component.scss']
})
export class AddApproveDenyComponent implements OnInit {

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
  selectedUserList;
  selectedUserEmailList = new Set();
  processUserList;
  chooseApproval : boolean = false;
  chooseNextProcess : boolean = false;
  waitingApproval : boolean = false;
  currentProcessStatus;
  projectAttachment;
  fdAttachment = new FormData();  

  hasPhoneFlag: boolean = false;
  
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
    this.currentProcessStatus = this.route.snapshot.queryParams['current_process_status'];

    this.isLoading = true;
    // this.getBriefProject();
    this.getProductProjectOpportunityWithProcess();
    this.createAddStatusForm();    
    // this.getProductProjectCurrProcessWorkUsers();
    
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
            console.log(this.briefProject);

            // used for send email and message to all approval people of the current process
            // not used any more
            // this.selectedUserList = res.current_process.process_administrators;

            let tempSelectedUserList = [];
            // right now loop the owner array of the project, get the owner who is responsible for the work of the current process
            // we will notify the person who is work on the process instead of approval, who should be the sales
            if (this.briefProject.current_process_status == 'Waiting Approval') {
                for (let i=0; i<this.briefProject.owners.length; i++) {
                    if (this.briefProject.owners[i].responsible_process_id == this.briefProject.current_process.id && this.briefProject.owners[i].permission == 'Work') {
                        tempSelectedUserList.push(this.briefProject.owners[i]);
                    }
                }
            }

            this.selectedUserList = tempSelectedUserList;
            console.log(this.selectedUserList);

            this.isLoading = false;

            if (this.currentProcessStatus == 'Approved') {
                // if (this.briefProject.product_item_number != null) {
                //     // this.messageContent = 'Your work on Process ' + this.briefProject.current_process.process_name + ' about Opportunity ' + this.briefProject.name + ' of Customer ' + this.briefProject.subject.name + ' has been approved. ' + 'The Item# of the related Product is ' + this.briefProject.product_item_number + '. ' + 'The Opportunity ' + this.briefProject.name + ' is created by ' + this.briefProject.created.by.first_name + ' ' + this.briefProject.created.by.last_name + '.';              
                //     this.messageContent = "The Customer's name is " + this.briefProject.subject.name + ". The Opportunity's name is " +  this.briefProject.name + ". The Decision is Approved. The updated time is " + this.briefProject.updated.at + "."
                    
                // } else {
                //     this.messageContent = 'Your work on Process ' + this.briefProject.current_process.process_name + ' about Opportunity ' + this.briefProject.name + ' of Customer ' + this.briefProject.subject.name + ' has been approved. ' + 'This Opportunity does not include a Product from our Inventory. ' + 'The Opportunity ' + this.briefProject.name + ' is created by ' + this.briefProject.created.by.first_name + ' ' + this.briefProject.created.by.last_name + '.';                            
                // }
                this.messageContent = "From Opportunity: The Customer's name is [" + this.briefProject.subject.name + "]. The Opportunity's name is [" +  this.briefProject.name + "]. The Decision is [Approved]. The updated time is " + this.briefProject.updated.at + "."
                
            } else if (this.currentProcessStatus == 'Denied') {
                // if (this.briefProject.product_item_number != null) {
                //     this.messageContent = 'Your work on Process ' + this.briefProject.current_process.process_name + ' about Opportunity ' + this.briefProject.name + ' of Customer ' + this.briefProject.subject.name + ' has been denied. ' + 'The Item# of the related Product is ' + this.briefProject.product_item_number + '. ' + 'The Opportunity ' + this.briefProject.name + ' is created by ' + this.briefProject.created.by.first_name + ' ' + this.briefProject.created.by.last_name + '.';              
                // } else {
                //     this.messageContent = 'Your work on Process ' + this.briefProject.current_process.process_name + ' about Opportunity ' + this.briefProject.name + ' of Customer ' + this.briefProject.subject.name + ' has been denied. ' + 'This Opportunity does not include a Product from our Inventory. ' + 'The Opportunity ' + this.briefProject.name + ' is created by ' + this.briefProject.created.by.first_name + ' ' + this.briefProject.created.by.last_name + '.';                            
                // }
                this.messageContent = "From Opportunity:  The Customer's name is [" + this.briefProject.subject.name + "]. The Opportunity's name is [" +  this.briefProject.name + "]. The Decision is [Denied]. The updated time is " + this.briefProject.updated.at + "."
                
            }
            
        }
    )
  }

  // getProductProjectCurrProcessWorkUsers() {
  //   this.departmentOpportunityService.getProductProjectCurrProcessWorkUsers(this.currentLoginCompanyId, this.projectId).subscribe(
  //       res => {
  //         this.selectedUserList = res;
  //         console.log(this.selectedUserList);
  //       }
  //   )
  // }

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
      console.log("add-approval-deny");

      if (this.addStatusForm.valid && this.saveOnce) {
          this.isLoading = true;
          this.saveOnce = false;

          // upload the file to project attachment by process id
        // this.departmentOpportunityService.addProjectAttachment(this.currentLoginCompanyId, this.briefProject.id, this.briefProject.current_process.id, this.fdAttachment).subscribe(
        //     res => {
        //         this.projectAttachment = res;
        //         this.addStatusForm.value.body[0].img = this.projectAttachment.url;

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
                    'process_id' : this.briefProject.current_process.id,
                    //   'complete' : this.addStatusForm.value.complete
                };
                this.departmentOpportunityService.addStatus(this.currentLoginCompanyId, request).subscribe(
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
                                if (this.hasPhoneFlag) {
                                    this.location.back();                                    
                                }
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
                        console.log("add status error");
                    }
                );
            // },
            // err => {
            //     this.isLoading = false;
            //     let message = "Please upload your attachment!";
            //     this.dialogService.openAlertDialog(message);
            //     this.saveOnce = true;
            //     console.log("upload attachment error");
            // }
        // );
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
                this.ng2ImgMax.resizeImage(this.selectedFile, 600, 10000).subscribe(
                    (res) => {
                        this.isLoading = false;
                        this.processedFile = new File([res], res.name);
                        
                        this.onAddImg(index);        
                        // this.fdAttachment.append('file', this.processedFile);
                        // this.fd.append('name', this.processedFile.name);
            
                    },
                    (err) => {
                        this.isLoading = false;                    
                        console.log('😢 Oh no!', err);
                    }
                );
            } else {
                // this.fdAttachment.append('file', this.selectedFile);
                this.isLoading = false; 
                
                // if the file is pdf, word, or excel instead of image, directly upload it to back-end 
                this.processedFile = this.selectedFile;            
                this.onAddImg(index);           
            }

            // let fileName = this.selectedFile.name;
            // let fileNameArr = fileName.split('.');
            // this.fdAttachment.append('name', fileNameArr[0]);                        
            // this.fdAttachment.append('category', this.briefProject.current_process.process_name);
            // this.fdAttachment.append('opportunity_process_id', this.briefProject.current_process.id);

            // this.fd.append('comment', this.attachmentForm.value.comment);
            // this.fdAttachment.append('description', this.selectedFile.type);
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

            }
        )
    }

    sendMessgaeToUser(){

        for (let i=0; i<this.selectedUserList.length; i++) {
            if(this.selectedUserList[i].phone != null){
                // the user does have phone number
                this.hasPhoneFlag = true;
                
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
                    }
                )           
            } else {
                // the user does not have phone number
                this.hasPhoneFlag = false;

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
