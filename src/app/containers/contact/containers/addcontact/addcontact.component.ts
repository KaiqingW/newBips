import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl,Validators, FormBuilder } from "@angular/forms";
import { Observable } from 'rxjs/Observable';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { NotesService } from 'app/core/services/notes.service';
import { MatChipInputEvent } from '@angular/material';
import { CompanyService } from 'app/core/services/company.service';
import { AuthService } from 'app/core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';
import { ToasterService } from 'app/core/services/toaster.service';
import { ImageService } from 'app/core/services/image.service';
import { ContactService } from 'app/core/services/contact.service';
import { Location } from '@angular/common';
import { CommonService } from 'app/core/services/common.service';

@Component({
    selector: 'addcontact',
    templateUrl:'addcontact.component.html',
    styleUrls:['addcontact.component.scss']
})

export class AddContactComponent implements OnInit{
    emailCtrl : FormControl;
    currentUserName;
    userEmailList ;
    sendEmialList = [];
    senfPhoneList =[];
    contactForm: FormGroup;
    currentLoginCompanyId;
    customer_id;
    isLoading;
    selectedUser;
    imputUser;
    contactUrl;
    positionOthers:boolean = false;
    default_avatar_url='https://orcasmart-dev.s3.us-east-2.amazonaws.com/images/DEM6o0kwR6IqaVRU1a1sPpYTdpT9sfy5AfLpMjhQ.png';

    data: any;
    cropperSettings;
    modalOpenCropImage = false;
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private toasterService: ToasterService,
        private authService : AuthService,
        // private leadService: LeadService,
        private imageService: ImageService,
        private contactService: ContactService,
        private location: Location,
        private notesService: NotesService,
        private commonService: CommonService
    ){
        //setting crop image begin
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.noFileInput = true;
        this.cropperSettings.width = 350;
        this.cropperSettings.height = 350;
        this.cropperSettings.dynamicSizing = true;
        this.data = {};
        //setting crop image end

        this.createContactForm();
        this. getCurrentUser();
        // this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        // this.customer_id = this.route.snapshot.paramMap.get('cusid');
        // if(!this.customer_id){
        //     this.customer_id = this.route.snapshot.paramMap.get('ven_id');
        // }

        this.emailCtrl = new FormControl();
        this.emailCtrl.valueChanges.subscribe(
            (term)=> {
                this.onSearch(term);
                // console.log(term);
            }
        )
    }

    ngOnInit(){
        setTimeout(() => {
            const buttonClick = document.getElementById("header-submit-edit");
            buttonClick.addEventListener("click", () => {
                // console.log(this.contactForm)
                // if(this.contactForm.valid ){
                    this.onSave();
                // }
                
            });
          }, 0);

        //   console.log(123);
    }

      getCurrentUser(){
      this.authService.getCurrentUser().subscribe(
          res=>{
              this.currentLoginCompanyId = res.user.vb_company.id;
              this.currentUserName = res.user.first_name + ' ' + res.user.last_name;
              console.log(this.currentLoginCompanyId);
              console.log(this.currentUserName );
          }
      )
  }

    onSearch(value){
        this.imputUser = value;
        // console.log(value);
        this.notesService.getUserEmailList(value).subscribe(
             res=>{
                 this.userEmailList = res;
                 console.log(this.userEmailList);
             }
         ) 
    }
    userSlected(value){
        this.selectedUser = value;
  
    }

    createContactForm(){
        this.contactForm = this.fb.group({
            first_name: [''],
            user_id :[''],
            last_name:[''],
            phone:[''],
            type:['0'],
            email: new FormControl('', [Validators.required, Validators.email]),
            position:[''],
            avatar_url:['https://orcasmart-dev.s3.us-east-2.amazonaws.com/images/DEM6o0kwR6IqaVRU1a1sPpYTdpT9sfy5AfLpMjhQ.png']
        })
    }

    onSave(){
        this.isLoading = true;
        if(this.selectedUser){
            if(this.selectedUser.avatar_url){
                // console.log(1);
                this.contactForm.value.avatar_url = this.selectedUser.avatar_url;
            }else if(this.contactUrl){
                // console.log(2);
                this.contactForm.value.avatar_url = this.contactUrl;
            }else{
                // console.log(3);
                this.contactForm.value.avatar_url = this.default_avatar_url;
            }
            
        }else{
            this.contactForm.value.email = this.imputUser;
        }
        
    //    console.log(this.contactForm.value);
        this.contactService.addPersonalContact( this.currentLoginCompanyId, this.contactForm.value).subscribe(
            res=>{
                this.sendEmailtoUser();
                this.location.back();
                this.toasterService.showToaster('Created Successfully!', '', 3000);
            }
        )
    }

     onFileChange(event) {
        if(event.target.files.length > 0) {
          let file = event.target.files[0];
          const myReader: FileReader = new FileReader();
            const image = new Image();
            myReader.onloadend = (loadEvent: any) => {
              image.onload = (event) => {
                if (image.height < 3000 && image.width < 3000) {
                  this.cropper.setImage(image);
                } else {
                  alert(`Image too large. close this box and wait for a few seconds.`);
                  this.cropper.setImage(image);
                }
              };
              image.src = loadEvent.target.result;
            };
          myReader.readAsDataURL(file);
          this.modalOpenCropImage = true;
        }
        // console.log(this.data)
      }

      // after crop image, upload the image and replace user's avatar_url
    cropImage() {
        this.isLoading = true;
        const formData = this.imageService.urltoFormData(this.data.image);
        this.imageService.uploadImage(formData).subscribe(
            res => {
            this.contactUrl = res.url;
            this.isLoading = false;
            this.modalOpenCropImage = false;
            },
            err => {
            this.isLoading = false;
            this.modalOpenCropImage = false;
            }
        );
    }

    mannualInput(){
        this.positionOthers = true;
    }

    sendEmailtoUser(){
        //send email to invited user
        this.pushtoArray(this.imputUser)
        let EmailValue = {
         "emails":this.sendEmialList ,
         "content": "Please login http://bips.orcasmart.us to check the info. If you don't have account, please sign in http://bips.orcasmart.us/auth/signup ",
         "subject": this.currentUserName + ' ' + "add you to as contact ",
       };

       this.commonService.sendBroadcastToCustomer(EmailValue).subscribe(
         res=>{
         }
       )
     }
    
     sendMessgaeToUser(){

       let SMSValue = {
         "phones":this.pushtoArray(this.contactForm.value.phone),
         "content":"You got a new meeting, login in http://orcasmart.com to check!"
       }
       
         this.commonService.sendInviteNoticeToUSer(SMSValue).subscribe(
           res=>{
             
           }
         )
     }

     pushtoArray(value){
         this.sendEmialList.push(value);
     }

     getEmailErrorMessage() {
        return this.contactForm.controls.email.hasError('required') ? 'You must enter a value' :
            this.contactForm.controls.email.hasError('email') ? 'Not a valid email' :
            '';

    }










  //order version add contact with employee api



//     @ViewChild('personInput') personInput;
//     isLoading = false;

//     // for angular material mat-chip-list and input
//     visible = true;
//     selectable = true;
//     removable = true;
//     addOnBlur = true;

//     //all the shared employee list to this company
//     addEmployeeList;
//     // for angular material mat-autocomplete
//     filteredEmails: Observable<any[]>;
//     // check whether user input is valid email address
//     emailCtrl: FormControl;
//     finalInput;
//     // this company's id
//     id;
//     // this company 
//     company;
//     companyEmployee;
//     // this variable is for change the event order of (matChipInputTokenEnd) in input and (optionSelected) in mat-autocomplete
//     selectedEmail;
//     // separator to separate user input as chips
//     separatorKeysCodes = [ENTER, COMMA];
//     // this email list is for view
//     emailList: Array<string> = [];
//     // all user list in the database
//     allUserList;
//     currentCompanyUserLevel;
//     //position
//     selected = "Manager" ;
//     vbCompanyId = 126;


//     constructor(
//         private notesService: NotesService,
//         private companyService: CompanyService,
//         private authService: AuthService
//     ){
//         this.id = 126;
//         this.isLoading = true;
//         this.emailCtrl = new FormControl();
//         this.emailCtrl.valueChanges.subscribe(
//           (term)=>{
//             this.onSearch(term);
//             this.finalInput = term;
//           }
//         )
//     }

//     ngOnInit(){
//         this.getCurrentUser();
//     }

//     getCurrentUser(){
//         this.authService.getCurrentUser().subscribe(
//             res=>{
//                 this.vbCompanyId = res.user.vb_company.id;
//                 console.log(this.vbCompanyId);
//             }
//         )
//     }

//     //search input string
//     onSearch(value){
//         this.notesService.getUserEmailList(value).subscribe(
//         res=>{
//             this.filteredEmails = res;
//         }
//         )
//     }


//       // for adding new chips after input token ends
//   add(event: MatChipInputEvent): void {
//     setTimeout(e => {
//         const input = event.input;
//         const value = this.selectedEmail || event.value;
//         // Add our email
//         this.addHelper(value);
//         // Reset the input value
//         if (input) {
//         input.value = '';
//         }
//         this.selectedEmail = '';
//     }, 0);
// }

//   // if value is valid email and not included in the emailList, then add it to email list
//   addHelper(value: string): void {
//     if ((value || '').trim()) {
//       value = value.trim().toLowerCase();
//       if (this.validateEmail(value) && !this.emailList.includes(value)) {
//         this.emailList.push(value);
//       }
//     }
//   }

//     // To change the event order, set timeout in add function and use selectedEmail to pass the clicked value from autocomplete list
//     selectOption(event) {
//         this.selectedEmail = event.option.value;
//       }
    
//       validateEmail(email) {
//         const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//         return re.test(email);
//       }
    
//       onSave(personInput) {
//         this.isLoading = true;
//           // getting personInput.value seems to be async, so use settimeout to change the event loop
//           this.addHelper(personInput.value);
//           setTimeout(() => {
//             // for every email in email list
//             for (let i = 0; i < this.emailList.length; i++) {
  
//               // search the user according to the email.
//               // if the user exists, then share with this user
//               // if not exists, invite this user using addNewShare function and api
//               this.notesService.getUserList(this.emailList[i]).subscribe(res => {
  
//                 if (res.data.length !== 0) {
//                   this.companyService.addEmployee(this.vbCompanyId, res.data[0].id).subscribe(res1 => {
//                     this.remove(this.emailList[i]);
                    
  
//                   });
//                 }
//               });
//             }
//           }, 0);
//         }

//     // remove email from emailList
//     remove(email: any): void {
//         const index = this.emailList.indexOf(email);
//         if (index >= 0) {
//         this.emailList.splice(index, 1);
//         }
//     }

}