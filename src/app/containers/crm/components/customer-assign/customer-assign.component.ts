import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from 'environments/environment';
import { CrmAssignmentService } from 'app/core/services/crm-assignment.service';
import { NotesService } from 'app/core/services/notes.service';
import { CompanyService } from 'app/core/services/company.service'
import { Location } from '@angular/common';
import { SearchService } from 'app/core/services/search.service';
import { AccountService } from 'app/core/services/account.service';
import { CommonService } from 'app/core/services/common.service';

@Component({
    selector:'customer-assign',
    templateUrl:'customer-assign.component.html',
    styleUrls:['customer-assign.component.scss']
})

export class CustomerAssignComponent implements OnInit{

    @Input() currentLoginCompanyId;
    @Input() customerId;
    @Input() value;
    assignmentList = [];
    userEmailList;
    selectedUser;
    emailCtrl : FormControl;
    formmatModalOpen:boolean = false;
    isLoading:boolean = false;

    NotifyContent = 'You have been assigned a new lead customer, Please contact the customers';
    EmailChecked:boolean = true;
    MessageChecked:boolean = false;

    constructor(
        private fb: FormBuilder,
        private crmAssignmentService : CrmAssignmentService,
        private notesService : NotesService,
        private location : Location,
        private searchService: SearchService,
        private accountService: AccountService,
        private commonService: CommonService
    ){
        this.emailCtrl = new FormControl();
        this.emailCtrl.valueChanges.subscribe(
            (term)=>{
                this.onSearch(term);
            }
        )
    }

    ngOnInit(){
       this.getCustomerValue();
       console.log(this.value);
    }
    getCustomerValue(){
      return  this.assignmentList.push(this.customerId);
    }

    onSubmit(){
        this.formmatModalOpen = false;
        this.isLoading = true;
        this.crmAssignmentService.assignToUser(this.currentLoginCompanyId, this.selectedUser.id, {customers: this.assignmentList}).subscribe(
            res=>{
                this.accountService.shareCustomer(this.currentLoginCompanyId, this.assignmentList[0], [this.value.followed_by.email]).subscribe(
                    res1 => {
                        this.assignmentList = [];
                })

                if(this.MessageChecked){
                    if(this.selectedUser.phone_number){
                        if(this.NotifyContent){
                            let messageValue = {
                                "phones":[this.selectedUser.phone_number],
                                "content": this.NotifyContent
                            }
                        this.notifyUserViaMessage(messageValue);
                        }else{
                            let messageValue = {
                                "phones":[this.selectedUser.phone_number],
                                "content": 'You have been assigned a new lead customer, Please contact the customers'
                            }
                            this.notifyUserViaMessage(messageValue);
                        } 
                    } 
                }
        
                if(this.EmailChecked){
                    if(this.NotifyContent){
                        let emailValue = {
                            "emails":[this.selectedUser.email],
                            "content":this.NotifyContent,
                            "subject":"You have new Customers"
                        }

                        console.log(this.selectedUser.email);
                        this.notifyUserViaEmail(emailValue);
                    }else{
                        let emailValue = {
                            "emails":[this.selectedUser.email],
                            "content":'You have been assigned a new lead customer, Please contact the customers',
                            "subject":"You have new Customers",
                        }
                        console.log(this.selectedUser.email);
                        console.log(emailValue);

                        this.notifyUserViaEmail(emailValue);
                    }
                    
                }  

                this.location.back();
                
            }
        )
    }

    notifyUserViaEmail(value){
        this.commonService.sendEmialtoNoticeEmployee(value).subscribe(
            res=>{
              
            }
        )
    };
    notifyUserViaMessage(value){
        this.commonService.sendInviteNoticeToUSer(value).subscribe(
            res=>{

            }
        )
    };

    onSearch(value){
        this.searchService.searchCompanyEmployee(value, this.currentLoginCompanyId).subscribe(
            res=>{
                this.userEmailList = res;
            }
        )
    }

    openSelectUser(){
        this.formmatModalOpen = true;
    }

    onCancel(){
        this.formmatModalOpen = false;
    }

    userSlected(value){
        this.selectedUser = value;
        console.log(value);
    }
}