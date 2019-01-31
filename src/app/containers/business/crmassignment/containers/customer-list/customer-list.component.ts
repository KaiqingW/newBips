import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { environment } from 'environments/environment';
import { CrmAssignmentService } from 'app/core/services/crm-assignment.service';
import { NotesService } from 'app/core/services/notes.service';
import { CommonService } from 'app/core/services/common.service';

@Component({
    selector: 'assignment-customer-list',
    templateUrl:'customer-list.component.html',
    styleUrls:['customer-list.component.scss']
})

export class CustomerListComponent implements OnInit{
    emailCtrl : FormControl;
    userEmailList ;
    imputUser;

    currentLoginCompanyId;
    customerList;
    isLoading;
    formmatModalOpen:boolean = false;
    currentType = 'lead';
    assignmentList=[];
    //define for paginate
    currentPage=1;
    previousPageUrl;
    nextPageUrl;
    //jump by page number
    defaultUrl;
    selectedUser;
    NotifyContent;
    EmailChecked:boolean = true;
    MessageChecked:boolean = false;
    moreFunction:boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private crmAssignmentService : CrmAssignmentService,
        private notesService:NotesService,
        private commonService: CommonService
    ){
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.currentType = this.route.snapshot.paramMap.get('cstype');
        this.isLoading = true;
        this.defaultUrl = environment.ORCA_API+`company/${this.currentLoginCompanyId}/crmcustomer/assignment?q=${this.currentType}&page=`;
 
        this.emailCtrl = new FormControl();
        this.emailCtrl.valueChanges.subscribe(
            (term)=> {
                this.onSearch(term);
                // console.log(term);
            }
        )
    }
    ngOnInit(){
        this.getCustomerList(this.currentType);
    }

    
    getCustomerList(value){
        this.isLoading = true;
        this.crmAssignmentService.getCustomerList(this.currentLoginCompanyId, value).subscribe(
            res=>{
                this.currentType = value;
                console.log(res);
                this.customerList = res.data;
                this.previousPageUrl = res.paging.previous;
                this.nextPageUrl = res.paging.next;
                this. currentPage=1;
                this.isLoading = false;
            }
        )
    }

    onChange(num){
        console.log(num);
        if(this.assignmentList.includes(num)){
            const index = this.assignmentList.indexOf(num);
            if (index !== -1) {
                this.assignmentList.splice(index, 1);
            }
        }else{
            this.assignmentList.push(num);
        }
        console.log(this.assignmentList);
    }

    selectAll(){
        var items = document.getElementsByName('acs');
        // console.log(items);
        for(var i=0; i<items.length; i++){
            let ckbox = <HTMLInputElement>items[i];
            ckbox.checked = true;
            if(!this.assignmentList.includes(+ckbox.value)){
                this.assignmentList.push(+ckbox.value);
            }
        }
        console.log( this.assignmentList);
    }

    unSelectAll(){
        var items = document.getElementsByName('acs');
        for(var i=0; i<items.length; i++){
            let ckbox = <HTMLInputElement>items[i];
            ckbox.checked = false;
        }
        this.assignmentList=[];
        console.log(this.assignmentList);
    }

    obSelectUser(){
        if( this.assignmentList.length){
            this.formmatModalOpen = true;
        }else{
            alert("please select contact")
        }
    }

    lastPage(){
        this.isLoading = true;
        this.currentPage = this.currentPage-1;
        if(this.previousPageUrl){
            this.getCustomerListByPage(this.previousPageUrl);
        }else{
            this.isLoading = false;
        }
    }

    nextPage(){
        this.isLoading = true;
        this.currentPage = this.currentPage+ 1;
        if(this.nextPageUrl){
            this.getCustomerListByPage(this.nextPageUrl);
        }else{
            this.isLoading = false;
        }
    }

    exactPage(pageNumber){
        this.getCustomerListByPage(this.defaultUrl+pageNumber);
    }

    getCustomerListByPage(value){
        this.isLoading = true;
        this.crmAssignmentService.getCustomerListByPage(value).subscribe(
            res=>{
                this.customerList = res.data;
                this.previousPageUrl = res.paging.previous;
                this.nextPageUrl = res.paging.next;
                this.currentPage = res.paging.currentPage;
                this.isLoading = false;
            }
        )
    }
    
    onCancel(){
        this.formmatModalOpen = false;
    }

    onSubmit(){
        this.formmatModalOpen = false;
        this.isLoading = true;
        if(this.selectedUser){
            console.log(this.assignmentList.length);
            let assignCustomerNumber = this.assignmentList.length;
            console.log(this.MessageChecked);
            this.crmAssignmentService.assignToUser(this.currentLoginCompanyId, this.selectedUser.id, {customers: this.assignmentList}).subscribe(
                res=>{
                    this.getCustomerList(this.currentType);

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
                                    "content": 'You have been assigned '+  assignCustomerNumber +' new ' + this.currentType +' customer, Please contact the customers'
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
                                "content":'You have been assigned '+  assignCustomerNumber + ' new ' + this.currentType +' customer, Please contact the customers',
                                "subject":"You have new Customers",
                            }
                            console.log(this.selectedUser.email);
                            console.log(emailValue);
    
                            this.notifyUserViaEmail(emailValue);
                        }
                        
                    }           
                 }
    
            )
            this.resetAssignValue();
        }
    }
    resetAssignValue(){
        // this.selectedUser = null;
        this.assignmentList=[];
        this.NotifyContent = null;
        // this.EmailChecked = true;
        // this.MessageChecked = false;

        this.emailCtrl = new FormControl();
        this.emailCtrl.valueChanges.subscribe(
            (term)=> {
                this.onSearch(term);
                // console.log(term);
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
        console.log(value);
    }

    getFullname(value){
        return value.first_name + ' ' +value.last_name
    }

    gotoCustomerDetails(){
        
    }

    toggleMoreAndLess(){
        this.moreFunction = !this.moreFunction;
    }

} 