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
import { processAdministratorListHeader } from 'app/core/models/header';

// used for request for approval, and next process, editted by yali
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

  selects = ['Request Approve', 'Next Step'];
  placeholder = "Request Approve";
  default = "Request Approve";

  // default, email is selected
  sendEmailCheck:boolean= true;
  // default, message is not selected
  sendMessageCheck:boolean = false;

  // checkEmailandMessage:boolean = false;
  messageContent = null;
  selectedUserList = new Set();
  selectedUserEmailList = new Set();
  processUserList;
  chooseApproval : boolean = false;
  chooseNextProcess : boolean = false;
  waitingApproval : boolean = false;
  currentUser;
  projectAttachment;
  fdAttachment = new FormData();  
  hasUploadedAttachment: boolean = false;

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
            // only upload attachment, addStatusForm, messageContent, selectedUserList, will call onSaveWithAttachment, otherwise show dialog
            if (!this.addStatusForm.invalid && this.messageContent != null && this.selectedUserList.size != 0) {
                // if the current process status of the project is 'approved', which means that someone just approved the process
                // so that the user does not need to upload files again
                // so the attachment is not necessary

                // Request for Approval
                // if has file, saves at the current process, does not copy the file to next process
                // message-info saves at the current process, does not take to next process
                if (!this.hasUploadedAttachment ) {
                    this.onSaveWithoutAttachment();
                } else if (this.hasUploadedAttachment ) {
                    this.onSaveWithAttachment();
                } 
                // if the current process status of the project is not 'approved', which means that they need to "Request for Approval" or "Next Process"
                // right now, the attachment is optional
                // if the user uploads attachment, then call onSaveWithAttachment() function to upload the attachment first
                // else if the user does not upload attachment, call onSaveWithoutAttachment() function, no uploaded attachment, directly add status to the back-end database
                
                // next process
                // if has file, save at current process, and also copy fie to next process
                // take message-info to next process
                // else if (this.chooseNextProcess && this.hasUploadedAttachment ){
                //     this.onSaveWithAttachment();                    
                // }  else if (this.chooseNextProcess && !this.hasUploadedAttachment ){
                //     this.onSaveWithoutAttachment();                    
                // } 
                // else {
                //     let message = "Please upload your attachment!";                    
                //     this.dialogService.openAlertDialog(message);
                // }
            } else {
                let message = "Please fill all fields!";                    
                this.dialogService.openAlertDialog(message);
            }
        });
    }, 0);
  }

//   getBriefProject() {
//     this.businessMeetingService.getBriefProject(this.currentLoginCompanyId, this.projectId).subscribe(
//       res => {
//         this.briefProject = res;
//         this.isLoading = false;
//         this.getCurrentUser();      

//         console.log(this.briefProject);
//       }
//     )
//   }

  getProductProjectOpportunityWithProcess() {
    this.departmentOpportunityService.getProductProjectOpportunityWithProcess(this.currentLoginCompanyId, this.projectId).subscribe(
        res => {
            this.briefProject = res;
            // if (this.briefProject.product_item_number != null) {
            //     this.messageContent = "Please start to work on the Opportunity " + this.briefProject.name + " which is created by " + this.briefProject.created.by.first_name + " " + this.briefProject.created.by.last_name + ". " + "This Opportunity belongs to the Customer " + this.briefProject.subject.name + '. ' + 'The Item# of the related Product is ' + this.briefProject.product_item_number + '. ';                
            // } else {
            //     this.messageContent = "Please start to work on the Opportunity " + this.briefProject.name + " which is created by " + this.briefProject.created.by.first_name + " " + this.briefProject.created.by.last_name + ". " + "This Opportunity belongs to the Customer " + this.briefProject.subject.name + '. ' + 'This Opportunity does not include a Product from our Inventory. ' ;                                
            // }

            this.messageContent = "Please start to work on this Opportunity. The sales' name is [" + this.briefProject.created.by.first_name + " " + this.briefProject.created.by.last_name + "]. " + "The Customer's name is [" + this.briefProject.subject.name + "]. The Opportunity's name is [" +  this.briefProject.name + "]. The updated time is " + this.briefProject.updated.at + "."            
            
            
            console.log(this.briefProject);

            this.isLoading = false;
            this.getCurrentUser(); 

            // if the length == 0, which means that this process does not have approval
            // and then if the status is working, which means the user can choose next process
            // or if the length != 0, which means that this process has approval
            // and then if the status is approved, which means the user can choose next process
            if ((this.briefProject.current_process.process_approvals.length == 0 && this.briefProject.current_process_status == 'In Progress') ||
                (this.briefProject.current_process.process_approvals.length != 0 && this.briefProject.current_process_status == 'Approved')) {               
                    
                this.chooseNextProcess = true;
            
                this.departmentOpportunityService.getProcess(this.currentLoginCompanyId, this.briefProject.current_process.next_process.id).subscribe(
                    res => {
                        this.processUserList = res.process_administrators;
                    }
                )
            }
            // or if the length != 0, which means that this process has approval
            // and then if the status is working, which means the user can choose approval for the process
            // or if the status is Denied, which means this process approval has been denied, the user can still choose approval again.            
             else if (this.briefProject.current_process.process_approvals.length != 0 &&
                    (this.briefProject.current_process_status == 'In Progress' || this.briefProject.current_process_status == 'Denied')){
                this.chooseApproval = true;
                this.processUserList = this.briefProject.current_process.process_approvals;                
            } 
            // if the status is Waiting Approval, which means the process is waiting for approval , show nothing
            else if (this.briefProject.current_process_status == 'Waiting Approval') {
                this.waitingApproval = true;
            }

            
        }
    )
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(
      res => {
          this.currentUser = res.user;

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

  onSaveWithAttachment() {
      if (this.addStatusForm.valid && this.saveOnce) {
          this.isLoading = true;
          this.saveOnce = false;

          console.log(this.onSaveWithAttachment);
          
          // upload the file to project attachment by process id
        this.departmentOpportunityService.addProjectAttachment(this.currentLoginCompanyId, this.briefProject.id, this.briefProject.current_process.id, this.fdAttachment).subscribe(
            res => {
                this.projectAttachment = res;
                this.addStatusForm.value.body[0].img = this.projectAttachment.url;

                // this.setImgInfoToFormData();

                // replace \n using <br>, editted by yali
                let body;
                body = this.addStatusForm.value.body.map(this.replaceLinbeBreak);

                // convert to string
                body = JSON.stringify(body);

                let addStatusRequest;
                // if the step is Request For Approval, add status to this current process
                if (this.chooseApproval) {
                    addStatusRequest = {
                        'company_meeting_project_id' : this.projectId,
                        'body' : body,
                        'type' : 'status',
                        //   'complete' : this.addStatusForm.value.complete,
                        'process_id' : this.briefProject.current_process.id,
                    }
                } 
                // if the step is Next Process, add status to next process
                else if (this.chooseNextProcess) {
                    addStatusRequest = {
                        'company_meeting_project_id' : this.projectId,
                        'body' : body,
                        'type' : 'status',
                        //   'complete' : this.addStatusForm.value.complete,
                        'process_id' : this.briefProject.current_process.next_process.id,
                    }
                }
                            
                this.departmentOpportunityService.addStatus(this.currentLoginCompanyId, addStatusRequest).subscribe(
                    res => {
                        
                        // convert the selectedUserList from Set to Array
                        let tempProcessSelectedUserList = Array.from(this.selectedUserList);
                        for (let k=0; k<tempProcessSelectedUserList.length; k++) {
                            let processRequest;
                            // if the process need to be approved, call approveProcess function
                            // change the current process status of the project to be "waiting approval"
                            // and add the selected user to be the owner of project, with current process id and permission that is "approval"
                            if (this.chooseApproval) {
                                processRequest = {
                                    'company_contact_id' : tempProcessSelectedUserList[k].id,
                                    'permission' : 'Approval',
                                    'owner_user_id' : tempProcessSelectedUserList[k].user_id,
                                    'responsible_process_id' : this.briefProject.current_process.id,
                                    'current_process_status' : 'Waiting Approval'
                                }
                            } 
                            // if the process does not need to be approved, 
                            // add the selected user to be the owner of the project, with next process id and permission that is "Work"
                            // change the current process status of the project to be "working"
                            else if (this.chooseNextProcess) {
                                processRequest = {
                                    'company_contact_id' : tempProcessSelectedUserList[k].id,
                                    'permission' : 'Work',
                                    'owner_user_id' : tempProcessSelectedUserList[k].user_id,
                                    'responsible_process_id' : this.briefProject.current_process.next_process.id,
                                    'current_process_status' : 'In Progress',
                                    'next_process_file_id' : this.projectAttachment.id,  
                                }
                            }
                            
                            console.log(processRequest);

                            this.departmentOpportunityService.changeProjectProcess(this.currentLoginCompanyId, this.briefProject.id, processRequest).subscribe(
                                res => {
                                    this.isLoading = false;   
                                    // send email or message
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
                                    console.log("change process error");
                                }
                            );                    
                        }           
                    },
                    err => {
                        this.isLoading = false;                                
                        console.log("add status error");
                    }
                );
            },
            err => {
                this.isLoading = false;
                let message = "Please upload your attachment!";
                this.dialogService.openAlertDialog(message);
                this.saveOnce = true;
                console.log("upload attachment error");
            }
        );
      }
  }

  onSaveWithoutAttachment() {
    if (this.addStatusForm.valid && this.saveOnce) {
        this.isLoading = true;
        this.saveOnce = false;

        console.log("no attachment");

        // upload the file to project attachment by process id
    //   this.departmentOpportunityService.addProjectAttachment(this.currentLoginCompanyId, this.briefProject.id, this.briefProject.current_process.id, this.fdAttachment).subscribe(
    //       res => {
    //           this.projectAttachment = res;
    //           this.addStatusForm.value.body[0].img = this.projectAttachment.url;

              this.setImgInfoToFormData();

              // replace \n using <br>, editted by yali
              let body;
              body = this.addStatusForm.value.body.map(this.replaceLinbeBreak);

              // convert to string
              body = JSON.stringify(body);

              let addStatusRequest;
              // if the step is Request For Approval, add status to this current process
              if (this.chooseApproval) {
                  addStatusRequest = {
                      'company_meeting_project_id' : this.projectId,
                      'body' : body,
                      'type' : 'status',
                      //   'complete' : this.addStatusForm.value.complete,
                      'process_id' : this.briefProject.current_process.id,
                  }
              } 
              // if the step is Next Process, add status to next process
              else if (this.chooseNextProcess) {
                  addStatusRequest = {
                      'company_meeting_project_id' : this.projectId,
                      'body' : body,
                      'type' : 'status',
                      //   'complete' : this.addStatusForm.value.complete,
                      'process_id' : this.briefProject.current_process.next_process.id,
                  }
              }

              this.departmentOpportunityService.addStatus(this.currentLoginCompanyId, addStatusRequest).subscribe(
                  res => {
                      
                      // convert the selectedUserList from Set to Array
                      let tempProcessSelectedUserList = Array.from(this.selectedUserList);
                      for (let k=0; k<tempProcessSelectedUserList.length; k++) {
                          let processRequest;
                          // if the process need to be approved, call approveProcess function
                          // change the current process status of the project to be "waiting approval"
                          // and add the selected user to be the owner of project, with current process id and permission that is "approval"
                          if (this.chooseApproval) {
                              processRequest = {
                                  'company_contact_id' : tempProcessSelectedUserList[k].id,
                                  'permission' : 'Approval',
                                  'owner_user_id' : tempProcessSelectedUserList[k].user_id,
                                  'responsible_process_id' : this.briefProject.current_process.id,
                                  'current_process_status' : 'Waiting Approval'
                              }
                          } 
                          // if the process does not need to be approved, 
                          // add the selected user to be the owner of the project, with next process id and permission that is "Work"
                          // change the current process status of the project to be "working"
                          else if (this.chooseNextProcess) {
                              processRequest = {
                                  'company_contact_id' : tempProcessSelectedUserList[k].id,
                                  'permission' : 'Work',
                                  'owner_user_id' : tempProcessSelectedUserList[k].user_id,
                                  'responsible_process_id' : this.briefProject.current_process.next_process.id,
                                  'current_process_status' : 'In Progress',
                                //   'next_process_file_id' : this.projectAttachment.id,  
                              }
                          }
                          
                          this.departmentOpportunityService.changeProjectProcess(this.currentLoginCompanyId, this.briefProject.id, processRequest).subscribe(
                              res => {
                                  this.isLoading = false;   
                                  // send email or message
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
                                  console.log("change process error");
                              }
                          );                    
                      }           
                  },
                  err => {
                      this.isLoading = false;                                
                      console.log("add status error");
                  }
              );
    //       },
    //       err => {
    //           this.isLoading = false;
    //           let message = "Please upload your attachment!";
    //           this.dialogService.openAlertDialog(message);
    //           this.saveOnce = true;
    //           console.log("upload attachment error");
    //       }
    //   );
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
                        this.fdAttachment.append('file', this.processedFile);
                        // this.fd.append('name', this.processedFile.name);
            
                    },
                    (err) => {
                        this.isLoading = false;                    
                        console.log('😢 Oh no!', err);
                    }
                );
            } else {
                this.fdAttachment.append('file', this.selectedFile);
                this.isLoading = false;            
            }

            let fileName = this.selectedFile.name;
            let fileNameArr = fileName.split('.');
            this.fdAttachment.append('name', fileNameArr[0]);                        
            this.fdAttachment.append('category', this.briefProject.current_process.process_name);
            this.fdAttachment.append('opportunity_process_id', this.briefProject.current_process.id);

            // this.fd.append('comment', this.attachmentForm.value.comment);
            this.fdAttachment.append('description', this.selectedFile.type);

            // set hasUploadedAttachment to be true
            this.hasUploadedAttachment = true;
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
        console.log(this.selectedUserList);

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
            "subject": this.currentUser.first_name + ' ' + this.currentUser.last_name + 
                        " have sent a new message to you about the opportunity "+ this.briefProject.subject.name,
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
                        "phones":   tempPhoneArr,
                        "content": this.currentUser.first_name + ' ' + this.currentUser.last_name + 
                                    " have sent a new message to you about the opportunity "+ this.briefProject.subject.name + ". " + 
                                    "Please login in http://bips.orcasmart.us to check!",
                    }
                } else {
                    SMSValue = {
                        "phones":   tempPhoneArr,
                        "content": this.messageContent,
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
