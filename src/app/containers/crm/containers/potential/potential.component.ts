import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, NgForm, ReactiveFormsModule, FormGroupDirective } from "@angular/forms";

import { Potential, PotentialService } from "app/core/services/potential.service";
import { DialogService } from '../../../../core/services/dialog.service';
import { NotesService } from 'app/core/services/notes.service';
import { CrmAssignmentService } from 'app/core/services/crm-assignment.service';
import { SearchService } from 'app/core/services/search.service';
import { AccountService } from 'app/core/services/account.service';
import { CommonService } from 'app/core/services/common.service';

@Component ({
    selector:"potential",
    templateUrl:"potential.component.html",
    styleUrls:['potential.component.scss']
})

export class PotentialComponent implements OnInit{

    potentiallist$:Potential[];
    potentialList2;
    private selectedId: number;
    currentLoginCompanyId;
    isLoading;
    totalNumber;
    currentCompanyUser;
    currentUserName;
    //search component
    adminChoices = ['CompanyName', 'EmployeeName','Description','Website','Industry','CompanyEmail','Memo'];
    normalChoices = ['CompanyName','Description','Website','Industry','CompanyEmail','Memo'];
    choiceValueCtrl: FormControl;
    inputValueCtrl: FormControl;
    choiceValue = 'CompanyName';
    inputValue;

    isDataLoading;
    //store next url to fetch more leads
    next:'';
     
    //count mouse wheel
    countMouseWheel = 0;

    // set naximum refresh height
    refreshHeight = 400;

    //for assign account out side
    emailCtrl : FormControl;
    userEmailList;
    selectAssignedUser;
    assignmentList= [];
    assignModalOpen:boolean = false;
    currentLoginUserId;
    originAccountFollowUserEmail;
    unreadAssignNumber;
    //assign user and send email or message
    NotifyContent;
    EmailChecked:boolean = true;
    MessageChecked:boolean = false;

    filterType;
    filterValue;

    constructor(
        private potentialService: PotentialService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private dialogService: DialogService,
        private router: Router,
        private notesService : NotesService,
        private crmAssignmentService: CrmAssignmentService,
        private searchService: SearchService,
        private accountService: AccountService,
        private commonService: CommonService
    ){
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.filterType = this.route.snapshot.paramMap.get('type'); //filter type
        this.filterValue = this.route.snapshot.paramMap.get('value');// filter value
        this.isLoading = true;

        //for serach customer
        this.choiceValueCtrl = new FormControl();
        this.choiceValueCtrl.valueChanges.subscribe(
            (res) => {
                // get customer by type
                this.choiceValue = res;
                // if (res == 'All') {
                //     this.getCurrentCompanyUserInfo();
                //     // this.inputValueCtrl =new FormControl;
                // }
            }
        )

        this.inputValueCtrl = new FormControl();
        this.inputValueCtrl.valueChanges.subscribe(
            (res) => {
                //get customer by filter input
                this.inputValue = res;
            }
        )

        //for search employee to assign 
        this.emailCtrl = new FormControl();
        this.emailCtrl.valueChanges.subscribe(
            (term)=>{
                this.onSearchEmployee(term);
            }
        )

        if(this.filterType&&this.filterValue){
            this.choiceValue = this.filterType;
            this.inputValue = this.filterValue;
        }
    }

    ngOnInit(){
        this.getCurrentCompanyUserInfo();
    }

    getCurrentCompanyUserInfo(){
        this.isLoading = true;
        this.authService.getCurrentUser().subscribe(
            res=>{
                this.currentLoginUserId = res.user.id;
                this.currentUserName = res.user.first_name + ' ' + res.user.last_name;
                this.currentCompanyUser = res.user.employed_companies.find(n =>n.id == this.currentLoginCompanyId);
                if( this.currentCompanyUser.is_admin >= 1){
                    this.adminGetCustomerByFilterValue(this.filterType);
                }else{
                    this.normalUserGetCustomerByFilterValue(this.filterType);
                }
            }
        )
    }

    //if this user is admin call this function
    getAdminLeadList(){
        // console.log('adi-------');
        this.potentialService.getAdminList(this.currentLoginCompanyId).subscribe(
            res=>{
                this.potentiallist$ = res.data;
                this.totalNumber = res.paging.total;
                this.unreadAssignNumber = res.paging.unreadAssignCount;
                this.isLoading = false;
                this.next = res.paging.next;
                
            },
            err=>{
                if(err.error.message.includes('Unknown column')){
                    alert('Please contact Orcasmart DBA to maintain the database');
                }
                this.isLoading = false;
            }
        )
    }

    //get potetnial list by user 
    getUserPotentialList(){
        this.potentialService.getPotentialList(this.currentLoginCompanyId).subscribe(
            res=>{
                // console.log('123');
                this.potentiallist$ = res.data;
                this.totalNumber = res.paging.total;
                // console.log(res.data);
                this.unreadAssignNumber = res.paging.unreadAssignCount;
                this.isLoading = false;
                this.next = res.paging.next;
            },
            err=>{
                if(err.error.message.includes('Unknown column')){
                    alert('Please contact Orcasmart DBA to maintain the database');
                }
                this.isLoading = false;
            }
        )
    }

    //scroll to get more leads
    public onMouseWheel(evt) {
        // console.log(evt);
    if(evt.target.scrollTop > this.refreshHeight){
        //get my next page of leads
        if(this.next !=null){
            this.isDataLoading = true;
            this.refreshHeight = this.refreshHeight + 900;
            this.potentialService.getPotentialListNext(this.next).subscribe(
                res =>{
                    this.potentialList2 = res.data;
                    for (var i = 0; i< this.potentialList2.length; i++){
                        this.potentiallist$.push(this.potentialList2[i]);
                    }
                    this.next = res.paging.next;
                    this.isDataLoading = false;
                },err =>{
                    this.isLoading = false;
                }
            )}
    }
    }

    getFullName(first_name, last_name){
        return first_name + " " + last_name
    }

    onGetNav(event) {
        if (event.type == 'phone') {
            if (!event.account.telephone_number) {
                this.dialogService.openAlertDialog('This account doesnt provide phone number.');
                return;
            }
            window.open(`tel:${event.account.telephone_number}`);
        } else if (event.type == 'email') {
            if (!event.account.email) {
                this.dialogService.openAlertDialog('This account doesnt provide email.');
                return;
            }
            window.open(`mailto:${event.account.email}`);
        } else if (event.type == 'website') {
            if (!event.account.website) {
                this.dialogService.openAlertDialog('This account doesnt provide website.');
                return;
            }
            window.open(`http://${event.account.website}`, "_blank");
        } else if (event.type == 'notes') {
            this.router.navigate([`${event.account.id}/notes/notesSubject`], { relativeTo: this.route });
        } else if (event.type == 'quotes') {
            this.router.navigate([`${event.account.id}/salesentity/quote`], { relativeTo: this.route });
        }else if(event.type =='assign'){
            // console.log(event.account.id);
            this.originAccountFollowUserEmail = event.account.followed_by.email;
            this.NotifyContent =  this.currentUserName + ' assigned a new potential customer in CRM, name is ' +  "'" + event.account.name +  "'" + ', Please check it in account and contact the customer. ' + window.location.href + `/`+ event.account.id;
            this.assignModalOpen = true;
            this.assignmentList.push(event.account.id);
            // console.log(this.assignModalOpen);
        }else if( event.type == 'contacts' ){
            this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/customer/${event.account.id}/contacts`]);
        }else if(event.type == 'status'){
            
            if(event.account.lead_status == 'Active'){
                event.account.lead_status = 'Inactive';
                this.potentialService.changeCustomerStatus(this.currentLoginCompanyId, event.account.id, 'Inactive').subscribe(
                    res=>{}
                )
            }else if(event.account.lead_status == 'Inactive'){
                event.account.lead_status = 'Active';
                this.potentialService.changeCustomerStatus(this.currentLoginCompanyId, event.account.id, 'Active').subscribe(
                    res=>{}
                )
            }else if(!event.account.lead_status){
                event.account.lead_status = 'Active';
                this.potentialService.changeCustomerStatus(this.currentLoginCompanyId, event.account.id, 'Active').subscribe(
                    res=>{}
                ) 
            }
        }else if(event.type== 'evaluate'){
            if(event.account.evaluate =='good'){
                event.account.evaluate = 'bad';
                this.potentialService.changeCustomerEvaluate(this.currentLoginCompanyId, event.account.id, 'bad').subscribe(
                    res=>{}
                )
            }else if(event.account.evaluate =='bad'){
                event.account.evaluate = 'good';
                this.potentialService.changeCustomerEvaluate(this.currentLoginCompanyId, event.account.id, 'good').subscribe(
                    res=>{}
                )
            }else if(!event.account.evaluate){
                event.account.evaluate = 'good';
                this.potentialService.changeCustomerEvaluate(this.currentLoginCompanyId, event.account.id, 'good').subscribe(
                    res=>{}
                )
            }
        }
    }
    onCancelAssign(){
        this.assignModalOpen = false;
    }

    onSubmitAssign(){
        this.assignModalOpen = false;
        this.crmAssignmentService.assignToUser(this.currentLoginCompanyId, this.selectAssignedUser.id, {customers: this.assignmentList}).subscribe(
            res=>{
                this.accountService.shareCustomer(this.currentLoginCompanyId,this.assignmentList[0], [this.originAccountFollowUserEmail]).subscribe(
                    res1 => {
                        this.assignmentList = [];
                })
               
                if(this.MessageChecked){
                    if(this.selectAssignedUser.phone_number){
                        if(this.NotifyContent){
                            let messageValue = {
                                "phones":[this.selectAssignedUser.phone_number],
                                "content": this.NotifyContent
                            }
                        this.notifyUserViaMessage(messageValue);
                        }else{
                            let messageValue = {
                                "phones":[this.selectAssignedUser.phone_number],
                                "content": 'You have been assigned a new lead customer, Please contact the customers'
                            }
                            this.notifyUserViaMessage(messageValue);
                        } 
                    } 
                }
                if(this.EmailChecked){
                    if(this.NotifyContent){
                        let emailValue = {
                            "emails":[this.selectAssignedUser.email],
                            "content":this.NotifyContent,
                            "subject":"You have new Customers"
                        }

                        // console.log(this.selectAssignedUser.email);
                        this.notifyUserViaEmail(emailValue);
                    }else{
                        let emailValue = {
                            "emails":[this.selectAssignedUser.email],
                            "content":'You have been assigned a new lead customer, Please contact the customers',
                            "subject":"You have new Customers",
                        }
                        this.notifyUserViaEmail(emailValue);
                    }
                }   
                this.getCurrentCompanyUserInfo();
            } 
        )
        this.emailCtrl = new FormControl();
        this.emailCtrl.valueChanges.subscribe(
            (term)=>{
                this.onSearchEmployee(term);
            }
        )
    }

    notifyUserViaEmail(value){
        this.commonService.sendEmialtoNoticeEmployee(value).subscribe(
            res=>{}
        )
    };
    notifyUserViaMessage(value){
        this.commonService.sendInviteNoticeToUSer(value).subscribe(
            res=>{}
        )
    };

    onSearchEmployee(value){
        this.searchService.searchCompanyEmployee(value, this.currentLoginCompanyId).subscribe(
            res=>{
                this.userEmailList = res;
            }
        )
    }

    assignedUserSlected(value){
        this.selectAssignedUser = value;
    }

    getCustomerByFilterValue(value){
        console.log(value);
        this.isLoading = true;
        this.refreshHeight= 400;
        this.filterType = this.choiceValue;  
        this.filterValue = this.inputValue;
        console.log(this.filterValue);
        if (this.currentCompanyUser.is_admin >= 1) {
            this.adminGetCustomerByFilterValue(value);
        } else {
            this.normalUserGetCustomerByFilterValue(value);
        }
    }

    adminGetCustomerByFilterValue(value) {
        this.isLoading = true;
        this.refreshHeight = 400;
        console.log(this.filterValue);
        if(this.filterType&&this.filterValue){
            console.log('value');
            if(value == 'CompanyName'){
                this.adminGetCustomerListByFilterTypeAndFilterValue('name');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: 'CompanyName', value:this.inputValue}]);
    
            } else if(value == 'EmployeeName'){
                this.searchCustomerByEmployeeName(this.inputValue);
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: 'EmployeeName', value:this.inputValue}]);
            }else if(value == 'Description'){
                this.adminGetCustomerListByFilterTypeAndFilterValue('description');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: 'Description', value:this.inputValue}]);
    
            }else if(value == 'Website'){
                this.adminGetCustomerListByFilterTypeAndFilterValue('website');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: 'Website', value:this.inputValue}]);
    
            }else if(value == 'Industry'){
                this.adminGetCustomerListByFilterTypeAndFilterValue('industry');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: 'Industry', value:this.inputValue}]);
    
            }else if(value == 'CompanyEmail'){
                this.adminGetCustomerListByFilterTypeAndFilterValue('email');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: 'CompanyEmail', value:this.inputValue}]);
    
            }else if(value == 'Memo'){
                this.adminGetCustomerListByFilterTypeAndFilterValue('memo');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: 'Memo', value:this.inputValue}]);
            }else{
                this.isLoading = false;
            }
            
        }else if(this.filterType){
            this.getAdminLeadList();
            this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: this.filterType, value:''}]);
            
        }else{
            this.getAdminLeadList();
        }
        
    }

    adminGetCustomerListByFilterTypeAndFilterValue(filterType){
        this.potentialService.searchCustomerByFieldName(this.currentLoginCompanyId, 'potential',  this.inputValue, filterType).subscribe(
            res=>{
                this.potentiallist$ = res.data;
                this.totalNumber = res.paging.total;
                this.next = res.paging.next;
                this.isLoading = false;
            },
            err=>{
                this.isLoading = false;
            }
        )
    }

    normalUserGetCustomerByFilterValue(value){
        this.isLoading = true;
        this.refreshHeight = 400;
        // console.log('eeeeeeeee');
        if(this.filterType&&this.filterValue){
            if(value == 'CompanyName'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('name');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: 'CompanyName', value:this.inputValue}]);
    
            } else if(value == 'EmployeeName'){
                this.searchCustomerByEmployeeName(this.inputValue);
            }else if(value == 'Description'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('description');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: 'Description', value:this.inputValue}]);
    
            }else if(value == 'Website'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('website');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: 'Website', value:this.inputValue}]);
    
            }else if(value == 'Industry'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('industry');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: 'Industry', value:this.inputValue}]);
    
            }else if(value == 'CompanyEmail'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('email');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: 'CompanyEmail', value:this.inputValue}]);
    
            }else if(value == 'Memo'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('memo');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: 'Memo', value:this.inputValue}]);
            }else{
                this.isLoading = false;
            }
        }else if(this.filterType){
            this.getUserPotentialList();
            this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/potential`,{type: this.filterType, value:''}]);
        }else{
            this.getUserPotentialList();
        }
    }

    employeeGetCustomerListByFilterTypeAndFilterValue(filterType){
        this.potentialService.normalUserSearchCustomerByFiledName(this.currentLoginCompanyId, 'potential',  this.inputValue, filterType).subscribe(
            res=>{
                this.potentiallist$ = res.data;
                this.totalNumber = res.paging.total;
                this.next = res.paging.next;
                this.isLoading = false;
            },
            err=>{
                this.isLoading = false;
            }
        )
    }

     //serarch customer by employee name
     searchCustomerByEmployeeName(value){
        this.refreshHeight = 400;
        this.potentialService.getCustomerByEmployeeName(this.currentLoginCompanyId, 'potential', value).subscribe(
            res=>{
                this.potentiallist$= res.data;
                this.totalNumber = res.paging.total;
                this.next = res.paging.next;
                this.isLoading = false;
            }
        )
    }

    //make the assigned customer read
    readAssignedCustomer(customer){
        if(customer.followed_by.id == this.currentLoginUserId){
            this.crmAssignmentService.deleteAssignAt(this.currentLoginCompanyId, customer.id ).subscribe(
                res=>{
                }
            )
        }
    }
}
