import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { Account, AccountService } from "app/core/services/account.service";
import { DialogService } from '../../../../core/services/dialog.service';
import { NotesService } from 'app/core/services/notes.service';
import { CrmAssignmentService } from 'app/core/services/crm-assignment.service';
import { SearchService } from 'app/core/services/search.service';
import { CommonService } from 'app/core/services/common.service';

@Component({
    selector: "account",
    templateUrl: "account.component.html",
    styleUrls: ['account.component.scss']
})

export class AccountComponent implements OnInit {
    accountlist$: Account[];
    accountList2;
    private selectedId: number;
    currentLoginCompanyId;
    isLoading;
    totalNumber;
    currentCompanyUser;
    currentUserName;


    isDataLoading;
    //store next url to fetch more leads
    next: '';

    //count mouse wheel
    countMouseWheel = 0;

    // set naximum refresh height
    refreshHeight = 400;

    //for assign account out side
    assignModalOpen:boolean = false;
    emailCtrl : FormControl;
    userEmailList;
    selectAssignedUser;
    assignmentList= [];
    unreadAssignNumber;

    //for search customer
    adminChoices = ['CompanyName', 'EmployeeName','Description','Website','Industry','CompanyEmail','Memo'];
    normalChoices = ['CompanyName','Description','Website','Industry','CompanyEmail','Memo'];
    choiceValueCtrl: FormControl;
    inputValueCtrl: FormControl;
    choiceValue = 'CompanyName' ;
    inputValue;
    currentLoginUserId;
    originAccountFollowUserEmail;
    //assign user and send email or message
    NotifyContent;
    EmailChecked:boolean = true;
    MessageChecked:boolean = false;

    filterType;
    filterValue;

    constructor(
        private accountService: AccountService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router,
        private dialogService: DialogService,
        private notesService : NotesService,
        private crmAssignmentService: CrmAssignmentService,
        private searchService: SearchService,
        private commonService: CommonService
    ) {
        console.log(window.location.href);
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');

        //for search employee to assign 
        this.emailCtrl = new FormControl();
        this.emailCtrl.valueChanges.subscribe(
            (term)=>{
                this.onSearchEmployee(term);
            }
        )
        this.initialSearchSetUp();

        if(this.filterType&&this.filterValue){
            this.choiceValue = this.filterType;
            this.inputValue = this.filterValue;
        }
    }

    ngOnInit() {
        this.getCurrentCompanyUser();
    }

    //get CurrentCompanyUser infomation
    getCurrentCompanyUser() {
        this.isLoading = true;
        this.authService.getCurrentUser().subscribe(
            res => {
                this.currentLoginUserId = res.user.id;
                this.currentUserName = res.user.first_name + ' ' + res.user.last_name;
                // console.log(res);
                // console.log(this.currentUserName);
                this.currentCompanyUser = res.user.employed_companies.find(n => n.id == this.currentLoginCompanyId);
                if (this.currentCompanyUser.is_admin >= 1) {
                    this.adminGetCustomerByFilterValue(this.filterType);
                } else {
                    this.employeeGetCustomerByFilterValue(this.filterType);
                }
            }
        )
    }

    //if this user is admin call this function
    getAdminAccountList() {
        this.accountService.getAdminList(this.currentLoginCompanyId).subscribe(
            res => {
                this.accountlist$ = res.data;
                this.unreadAssignNumber = res.paging.unreadAssignCount;
                this.totalNumber = res.paging.total;
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

    //get account list by user
    getUserAccountList() {
        this.accountService.getAccountList(this.currentLoginCompanyId).subscribe(
            res => {
                this.accountlist$ = res.data;
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

    //scroll to get more leads
    onMouseWheel(evt) {
        if (evt.target.scrollTop > this.refreshHeight) {
                if (this.next != null){
                    this.isDataLoading = true;
                this.refreshHeight = this.refreshHeight + 900;
                this.accountService.getAccountListnext(this.next).subscribe(
                    res => {
                        this.accountList2 = res.data;
                        for (var i = 0; i < this.accountList2.length; i++) {
                            this.accountlist$.push(this.accountList2[i]);
                        }
                        this.next = res.paging.next;
                        this.isDataLoading = false;
                    }, err => {
                        this.isLoading = false;
                    }
                )
            }
        }
    }

    getFullName(first_name, last_name) {
        return first_name + " " + last_name;
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
            this.router.navigate([`${event.account.id}/salesentity/quote/draft`], {relativeTo: this.route});
        } else if(event.type =='assign'){
            this.originAccountFollowUserEmail = event.account.followed_by.email;
            this.NotifyContent =  this.currentUserName + ' assigned a new account customer in CRM, name is ' +  "'" + event.account.name +  "'" + ', Please check it in account and contact the customer. ' + window.location.href + `/`+ event.account.id;
            this.assignModalOpen = true;
            this.assignmentList.push(event.account.id);
        }else if( event.type == 'contacts' ){
            this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/customer/${event.account.id}/contacts`]);
        }else if(event.type == 'status'){
            
            if(event.account.lead_status == 'Active'){
                event.account.lead_status = 'Inactive';
                this.accountService.changeCustomerStatus(this.currentLoginCompanyId, event.account.id, 'Inactive').subscribe(
                    res=>{}
                )
            }else if(event.account.lead_status == 'Inactive'){
                event.account.lead_status = 'Active';
                this.accountService.changeCustomerStatus(this.currentLoginCompanyId, event.account.id, 'Active').subscribe(
                    res=>{}
                )
            }else if(!event.account.lead_status){
                event.account.lead_status = 'Active';
                this.accountService.changeCustomerStatus(this.currentLoginCompanyId, event.account.id, 'Active').subscribe(
                    res=>{}
                ) 
            }
        }else if(event.type== 'evaluate'){
            if(event.account.evaluate =='good'){
                event.account.evaluate = 'bad';
                this.accountService.changeCustomerEvaluate(this.currentLoginCompanyId, event.account.id, 'bad').subscribe(
                    res=>{}
                )
            }else if(event.account.evaluate =='bad'){
                event.account.evaluate = 'good';
                this.accountService.changeCustomerEvaluate(this.currentLoginCompanyId, event.account.id, 'good').subscribe(
                    res=>{}
                )
            }else if(!event.account.evaluate){
                event.account.evaluate = 'good';
                this.accountService.changeCustomerEvaluate(this.currentLoginCompanyId, event.account.id, 'good').subscribe(
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
                this.getCurrentCompanyUser();
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
            this.employeeGetCustomerByFilterValue(value);
        }
    }

    adminGetCustomerByFilterValue(value) {
        this.isLoading = true;

        if(this.filterType&&this.filterValue){
            if(value == 'CompanyName'){
                this.admingetCustomerListByFilterTypeAndFilterValue('name');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'CompanyName', value:this.inputValue}]);
            } else if(value == 'EmployeeName'){
                this.searchCustomerByEmployeeName(this.inputValue);
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'EmployeeName', value:this.inputValue}]);
            }else if(value == 'Description'){
                this.admingetCustomerListByFilterTypeAndFilterValue('description');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'Description', value:this.inputValue}]);
      
            }else if(value == 'Website'){
                this.admingetCustomerListByFilterTypeAndFilterValue('website');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'Website', value:this.inputValue}]);
    
            }else if(value == 'Industry'){
                this.admingetCustomerListByFilterTypeAndFilterValue('industry');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'Industry', value:this.inputValue}]);
       
            }else if(value == 'CompanyEmail'){
                this.admingetCustomerListByFilterTypeAndFilterValue('email');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'CompanyEmail', value:this.inputValue}]);
    
            }else if(value == 'Memo'){
                this.admingetCustomerListByFilterTypeAndFilterValue('memo');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'Memo', value:this.inputValue}]);
            }else{
                this.isLoading = false;
            }
        }else if(this.filterType){
            this.getAdminAccountList();
            this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: this.filterType, value:''}]);
            
        }else{
            // console.log('admin');
            this.getAdminAccountList();
        }
    }

    admingetCustomerListByFilterTypeAndFilterValue(filterType){
        this.accountService.searchCustomerByFieldName(this.currentLoginCompanyId, 'account', this.inputValue, filterType).subscribe(
            res=>{
                this.accountlist$ = res.data;
                this.totalNumber = res.paging.total;
                this.next = res.paging.next;
                this.isLoading = false;
            },
            err=>{
                this.isLoading = false;
            }
        )
    }

    employeeGetCustomerByFilterValue(value) {
        this.isLoading = true;

        if(this.filterType&&this.filterValue){
            if(value == 'CompanyName'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('name');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'CompanyName', value:this.inputValue}]);
            }
            //  else if(value == 'EmployeeName'){
            //     this.searchCustomerByEmployeeName(this.inputValue);
            //     this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'EmployeeName', value:this.inputValue}]);
            // }
            else if(value == 'Description'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('description');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'Description', value:this.inputValue}]);
      
            }else if(value == 'Website'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('website');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'Website', value:this.inputValue}]);
    
            }else if(value == 'Industry'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('industry');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'Industry', value:this.inputValue}]);
       
            }else if(value == 'CompanyEmail'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('email');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'CompanyEmail', value:this.inputValue}]);
    
            }else if(value == 'Memo'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('memo');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: 'Memo', value:this.inputValue}]);
            }else{
                this.isLoading = false;
            }
        }else if(this.filterType){
            this.getUserAccountList();
            this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account`,{type: this.filterType, value:''}]);
            
        }else{
            this.getUserAccountList();
        }
    }

    employeeGetCustomerListByFilterTypeAndFilterValue(filterType){
        this.accountService.normalUserSearchCustomerByFiledName(this.currentLoginCompanyId, 'account',  this.inputValue, filterType).subscribe(
            res=>{
                this.accountlist$ = res.data;
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
        // this.inputValueCtrl =new FormControl;
        this.accountService.getCustomerByEmployeeName(this.currentLoginCompanyId, 'account', value).subscribe(
            res=>{
                this.accountlist$ = res.data;
                console.log(res);
                this.totalNumber = res.paging.total;
                this.next = res.paging.next;
                this.isLoading = false;
            }
        )
    }

    initialSearchSetUp(){
            //for serach customer
            this.choiceValueCtrl = new FormControl();
            this.choiceValueCtrl.valueChanges.subscribe(
                (res) => {
                    // get customer by type
                    // console.log(res);
                    this.choiceValue = res;
                    if (res == 'All') {
                        this.getCurrentCompanyUser();
                        // this.inputValueCtrl =new FormControl;
                    }
                }
            )

            this.inputValueCtrl = new FormControl();
            this.inputValueCtrl.valueChanges.subscribe(
                (res) => {
                    //get customer by filter input
                    this.inputValue = res;
                    // console.log(res);
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
