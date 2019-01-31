import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ToasterService } from 'app/core/services/toaster.service';
import { MatChipInputEvent } from '@angular/material'

import { DialogService } from 'app/core/services/dialog.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AuthService } from "app/core/services/auth.service";
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { OpportunityService } from 'app/core/services/opportunity.service';
import { CompanyCommonService } from 'app/core/services/company/common.service';

@Component({
    selector:'add-employee-opportunity',
    templateUrl:'add-employee.component.html',
    styleUrls:['add-employee.component.scss']
})

export class AddEmployeeOpportunityComponent implements OnInit{
    @ViewChild('personInput') personInput;
    isLoading = false;
    projectOwnName;

    // for angular material mat-chip-list and input
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;

    // all the shared user list to this subject
    sharedUserList;

    // for angular material mat-autocomplete
    filteredEmails: Observable<any[]>;

    // check whether user input is valid email address
    emailCtrl: FormControl = new FormControl();
    finalInput;

    // this email list is for view
    emailList: Array<string> = [];
    phoneNumberList: Array<string> =[];

    // this subject's id
    opportunitySettingId: number = 1;
    currentLoginCompanyId;

    // this variable is for change the event order of (matChipInputTokenEnd) in input and (optionSelected) in mat-autocomplete
    selectedEmail;

    // separator to separate user input as chips
    separatorKeysCodes = [ENTER, COMMA];

    // all user list in the database
    allUserList;

    sharedOrNot;

    // only can save once
    saveOnce: Boolean = true;  

    // get the employee of the company
    // for the company meeting, if the shared user is not the employee of the company,
    // cannot shared to that user
    companyEmployee;
    sendEmailCheck:boolean= true;
    sendMessageCheck:boolean = false;
    checkEmailandMessage:boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private toasterService: ToasterService,
        private dialogService: DialogService,
        private authService: AuthService,
        private companyCommonService : CompanyCommonService,
        private opportunityService: OpportunityService
    ){
        this.isLoading = true;
        this.currentLoginCompanyId = +this.route.snapshot.paramMap.get('cid');
        this.emailCtrl.valueChanges.subscribe(
            (term)=>{
              this.onSearch(term);
              this.finalInput = term;
            }
          )

    }

    ngOnInit(){
        console.log(this.route);
        setTimeout(() => {
          const buttonClick = document.getElementById("header-submit-edit");
          buttonClick.addEventListener("click", () => {
              this.onSave();
          });
        }, 0);

        this.getOpportunityEmployee();
    }
    
   
// for send email and message
    getCurrentUser(){
        if (this.authService.getOrcaToken()) {
        this.isLoading = true;
            this.authService.getCurrentUser().subscribe(
                data => {
                this.projectOwnName = data.user.first_name + ' '+ data.user.last_name;
                this.isLoading = false;
                },
                err => {
                this.isLoading = false;
                }
            );
        }
    }

// for adding new chips after input token ends
  add(event: MatChipInputEvent): void {
    setTimeout(e => {
      const input = event.input;
      const value = this.selectedEmail || event.value;
      // Add our email
      this.addHelper(value);
      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.selectedEmail = '';
    }, 0);
  }

 // if value is valid email and not included in the emailList, then add it to email list
 addHelper(value: string): void {
    if ((value || '').trim()) {
      value = value.trim().toLowerCase();
      if (this.validateEmail(value) && !this.emailList.includes(value)) {
        this.emailList.push(value);
      }
    }
  }

//search input string
  onSearch(value){
    this.companyCommonService.searchCompanyContact(this.currentLoginCompanyId, "email", value).subscribe(
      res=>{
        this.filteredEmails = res.data;        
      }
    )
  }

  // In default, add function add runs before selectOption.
  // To change the event order, set timeout in add function and use selectedEmail to pass the clicked value from autocomplete list
  selectOption(event) {
    this.selectedEmail = event.option.value;
  }

  getSlectedUserInfo(value){
    if((!this.phoneNumberList.includes(value.phone))&&(value.phone !== null)){
      this.phoneNumberList.push(value.phone);
    }
  }


  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  onSave() {
    this.isLoading = true;
      let request = {
        "emails": this.emailList,
        // "permission": "view"
      }
      console.log(this.currentLoginCompanyId, this.opportunitySettingId, request);
      // just sent the email to backend, the backend will check whether the email is the employee of the meeting
      // whether we have already shared the meeting to the email
      this.opportunityService.addOpportunityEmployee(this.currentLoginCompanyId, this.opportunitySettingId, request).subscribe(
        res => {
          this.checkEmailandMessage = true;
          this.location.back();
        },
        err => {
          this.isLoading = false;
          this.dialogService.openAlertDialog(err.error.message); 
          setTimeout(e => {
            this.location.back();
          }, 3000);          
        }
      )
    }

    getOpportunityEmployee(){
      this.opportunityService.getOpportunityEmployeeList(this.currentLoginCompanyId, this.opportunitySettingId).subscribe(
        res=>{
          this.sharedUserList = res;
          this.isLoading = false;
          console.log(res);
        }
      )
    }

    removeSharedUser(user){
      this.dialogService.openDialog().subscribe(result=>{
        if(result){
          this.isLoading = true;
          this.opportunityService.deleteOpportunityEmployee(this.currentLoginCompanyId, this.opportunitySettingId, user.id).subscribe(
            res=>{
              const idx = this.sharedUserList.indexOf(user);
              if (idx > -1) {
                this.sharedUserList.splice(idx, 1);
              }
              this.toasterService.showToaster('Cancel share finished');
              this.isLoading = false;
            }
          )
        }
      })
    }

  // remove email from emailList
  remove(email: any): void {
    const index = this.emailList.indexOf(email);
    if (index >= 0) {
      this.emailList.splice(index, 1);
    }
  }

  cancelNotifyMethod(){
    this.emailList =[];
    this.checkEmailandMessage = false;
    this.isLoading = true;
    this.getOpportunityEmployee();
  }

  conformNotifyMethod(){
    this.checkEmailandMessage = false;
    this.getOpportunityEmployee();
  }


}