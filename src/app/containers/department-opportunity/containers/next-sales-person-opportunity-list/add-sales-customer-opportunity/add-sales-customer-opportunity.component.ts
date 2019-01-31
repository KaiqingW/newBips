import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { UserService } from 'app/core/services/user.service';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';
import { DialogService } from 'app/core/services/dialog.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { error } from 'util';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';
import { SearchService } from 'app/core/services/search.service';
import { AuthService } from 'app/core/services/auth.service';

@Component({
  selector: 'add-sales-customer-opportunity',
  templateUrl: './add-sales-customer-opportunity.component.html',
  styleUrls: ['./add-sales-customer-opportunity.component.scss']
})
export class AddSalesCustomerOpportunityComponent implements OnInit {
  
    // for angular material mat-autocomplete
    // filteredSubjects: Observable<any[]>;

    isLoading: Boolean = false;

    // check whether it is uploading images
    isUploadingImg = false;

    companyId = 0;

    // add oppo subject
    addSubjectForm: FormGroup;
    imgsMap = new Map<number, string>();
    selectedImgIndex : number;
    selectedFile = null;
    processedFile = null;
    
    modalOpen = false;

    saveOnce: Boolean = true;

    // for angular material mat-chip-list and input
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;

    // for angular material mat-autocomplete
    filteredEmails: Observable<any[]>;
  
    // check whether user input is valid email address
    emailCtrl: FormControl = new FormControl();
    finalInput;

    // this variable is for change the event order of (matChipInputTokenEnd) in input and (optionSelected) in mat-autocomplete
    selectedUserName;
  
    // separator to separate user input as chips
    separatorKeysCodes = [ENTER, COMMA];

    userNameList: Array<string> = [];
    selectedCRMCompany;

    prevProjectId;
    currentUserCompany;
    currentUserId;
    // the owner of the current project, get the data from router url
    ownerPermission : boolean = false;
    salesUserId;

    constructor(
        private businessMeetingService: BusinessMeetingService,
        private fb: FormBuilder,
        private router: Router,
        private toasterService: ToasterService,
        private location: Location,
        private userService: UserService,
        private route: ActivatedRoute,
        private dialogService: DialogService,
        private imageService: ImageService,
        private ng2ImgMax: Ng2ImgMaxService,
        private departmentOpportunityService: DepartmentOpportunityService,
        private searchService: SearchService,
        private authService: AuthService,
        
    ) {
        this.prevProjectId = this.route.snapshot.paramMap.get('oppoPrevProjectId') ? +this.route.snapshot.paramMap.get('oppoPrevProjectId') : null;
        
        this.companyId = +localStorage.getItem("currentLoginCompanyId");

        // the data from queryParams is string, need to convert string to boolean
        this.ownerPermission = this.route.snapshot.queryParams['ownerPermission'].toLowerCase() == 'true' ? true : false;
        this.salesUserId = this.route.snapshot.queryParams['salesUserId'];
       
        this.createAddSubjectForm();

        this.emailCtrl.valueChanges.subscribe(
            (term)=>{
              this.onSearch(term);
              this.finalInput = term;
            }
          )

          this.getCurrentUser();
    }

    ngOnInit() {
        // add listener to the save button in the header tool bar
        setTimeout(() => {
            const buttonClick = document.getElementById('header-submit-edit');
            buttonClick.addEventListener('click', () => {
                if (!this.addSubjectForm.invalid && this.userNameList.length == 1) {
                    this.onSave();
                } else {
                    let message = "Please fill all fields!";                    
                    this.dialogService.openAlertDialog(message);
                }
            });
        }, 0);

    }

    // get the current logined user
    // if the user is admin of the company, then he can search all crm 
    // else he only can search the crm that he created
    getCurrentUser() {
        this.authService.getCurrentUser().subscribe(
            res => {
                this.currentUserCompany = res.user.employed_companies.find(n => n.id == this.companyId);   
                this.currentUserId = res.user.id;
            }
        )
    }

    // search email start
    // search input string
    onSearch(value){
        // not used right now
        // 1 has highest permission, who is the creater of the company
        // 2 is assigned admin of the company
        // both 1 and 2 is the admin of the company

        // if the current user is the admin of the company, and also is the owner of the sales project
        // then he can search all crm
        // if (this.currentUserCompany.is_admin >= 1 && this.ownerPermission) {
        //     this.searchService.searchCRMCompany(this.companyId, value, true).subscribe(
        //         res => {
        //             this.filteredEmails = res.data;   
        
        //         }
        //     )
        // }
        // // if the current user is not the admin of the company, then he can only search his own crm       
        // else if (this.currentUserCompany.is_admin == 0) {
        //     this.searchService.searchCRMCompany(this.companyId, value, false).subscribe(
        //         res=>{
        //             this.filteredEmails = res.data;   
        //         }
        //     )
        // }
        // // if the current user is the admin of the company, and also he is not the owner of the project
        // // then he can only search this sales's crm
        // else if (this.currentUserCompany.is_admin >= 1 && !this.ownerPermission) {
        //     this.searchService.searchCRMCompanyForOpportunity(this.companyId, value, true, this.salesUserId).subscribe(
        //         res => {
        //             this.filteredEmails = res.data;   
        //         }
        //     )
        // }

        // using right now
        // if the current user is the admin of the company, and also is the owner of the project
        // or the current user is not the admin of the company, is sales
        // simplify, is the current user is the owner of the project, then he can only search his own crm
        if (this.ownerPermission) {
            this.searchService.searchCRMCompany(this.companyId, value, false).subscribe(
                res => {
                    this.filteredEmails = res.data;   
        console.log("self");
                }
            )
        }
        // if the current user is not the admin of the company, then he can only search his own crm       
        // else if (this.currentUserCompany.is_admin == 0) {
        //     this.searchService.searchCRMCompany(this.companyId, value, false).subscribe(
        //         res=>{
        //             this.filteredEmails = res.data;   
        //         }
        //     )
        // }
        // if the current user is the admin of the company, and also he is not the owner of the project
        // then he can only search this sales's crm
        else if (this.currentUserCompany.is_admin >= 1 && !this.ownerPermission) {
            this.searchService.searchCRMCompanyForOpportunity(this.companyId, value, true, this.salesUserId).subscribe(
                res => {
                    this.filteredEmails = res.data;   
                    console.log("sales' crm");
                }
            )
        }
        
    }

    // for adding new chips after input token ends
    add(event: MatChipInputEvent): void {
        setTimeout(e => {
        const input = event.input;
        const value = this.selectedUserName || event.value;
        
        if ((value || '').trim()) {
            //     value = value.trim().toLowerCase();
            if (!this.userNameList.includes(value)) {
                // because the array will only have one user name, when input new user, 
                // just use the new user to replace the old one, editted by yali
                this.userNameList[0] = value;
            }
        }
        
        // Reset the input value
        if (input) {
            input.value = '';
        }
        this.selectedUserName = '';
        }, 0);
    }

    // remove email from userNameList
    remove(email: any): void {
        const index = this.userNameList.indexOf(email);
        if (index >= 0) {
        this.userNameList.splice(index, 1);
        }

        this.selectedCRMCompany = null;
        this.addSubjectForm.value.description[0].text = null;
        
    }

    getSlectedUserInfo(value){
        // record the contact_id of the user, sned back to backend for add share and owner
        this.selectedCRMCompany = value;
        this.addSubjectForm.value.description[0].text = value.description;

        
        // if((!this.phoneNumberList.includes(value.phone))&&(value.phone !== "")){
        //     this.phoneNumberList.push(value.phone);
        // }

    }

    // In default, add function add runs before selectOption.
    // To change the event order, set timeout in add function and use selectedUserName  to pass the clicked value from autocomplete list
    selectOption(event) {
        this.selectedUserName = event.option.value;
    }

    // search end

    createAddSubjectForm() {
        this.addSubjectForm = this.fb.group({
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

    // replace \n using <br>, editted by yali
    replaceLinbeBreak(value) {
        value.text = value.text.replace(/(\n)+/g, '<br>')
        return value;
    }

    onSave() {
        if (this.addSubjectForm.valid && this.saveOnce) {
            this.isLoading = true;
            this.saveOnce = false;
            this.setImgInfoToFormData();

            // replace \n using <br>, editted by yali
            let description;
            description = this.addSubjectForm.value.description.map(this.replaceLinbeBreak);

            // convert to string
            description = JSON.stringify(description);

            var request = {               
                'name': this.userNameList[0], 
                'description' : description,
                'subject_type' : 'opportunity',
                'prev_meeting_project' : this.prevProjectId,
                'customer_company_id' : this.selectedCRMCompany.id
            };
            // right now, may have same crm company name
            this.departmentOpportunityService.addSubject(this.companyId, request).subscribe(
                res => {
                    this.isLoading = false;
                    this.location.back();
                },
                err => {
                    this.dialogService.openAlertDialog(err.error.message).subscribe(
                      res => {
                        this.isLoading = false;
                        this.location.back();                    
                        console.log(err.error.message);
                      }
                    ); 
                }
            );
        }
    }

    setImgInfoToFormData(){
        this.imgsMap.forEach((imgUrl, index) => {
            this.addSubjectForm.value.description[index].img = imgUrl;
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
                
                // this.noteForm.value.description[index].img = res.url;
                this.imgsMap.set(index, res.url);
            },
            (err) => {
                this.isLoading = false;
                
            }
        );
    }
    
    onAddMore(){   
        const control = <FormArray>this.addSubjectForm.controls['description'];
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
        if(this.addSubjectForm.controls.description['controls'].length > 1){
            const control = <FormArray>this.addSubjectForm.controls['description'];
            control.removeAt(i);
            this.imgsMap.delete(i);
        }
    }

}
  