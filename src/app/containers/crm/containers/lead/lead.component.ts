import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, NgForm, ReactiveFormsModule, FormGroupDirective } from "@angular/forms";
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { AuthService } from 'app/core/services/auth.service';
import { Lead, LeadService } from 'app/core/services/lead.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { SearchService } from 'app/core/services/search.service';
import { NotesService } from 'app/core/services/notes.service';
import { CrmAssignmentService } from 'app/core/services/crm-assignment.service';
import { CommonService } from 'app/core/services/common.service';
import { AccountService } from 'app/core/services/account.service';
 
@Component({
    selector: "lead",
    templateUrl: "lead.component.html",
    styleUrls: ['lead.component.scss']
})

export class LeadComponent implements OnInit, AfterViewChecked {

    leadlist$: Lead[];
    leadList2;
    private selectedId: number;
    isLoading;
    isDataLoading;
    currentLoginCompanyId;
    currentLoginUserInfo;
    totalNumber;
    currentCompanyUser;
    currentUserName;
    filterType;
    filterValue;

    //store next url to fetch more leads
    next: '';
    //count mouse wheel
    countMouseWheel = 0;
    // set naximum refresh height
    refreshHeight = 400;

    //for search customer
    adminChoices = ['CompanyName', 'EmployeeName','Description','Website','Industry','CompanyEmail','Memo'];
    normalChoices = ['CompanyName','Description','Website','Industry','CompanyEmail','Memo'];
    // initialType = this.choices[0];
    choiceValueCtrl: FormControl;
    inputValueCtrl: FormControl;
    choiceValue = 'CompanyName' ;
    inputValue;

    //for assign account out side
    assignModalOpen:boolean = false;
    emailCtrl : FormControl;
    userEmailList;
    selectAssignedUser;
    assignmentList= [];
    currentLoginUserId;

    NotifyContent ;
    EmailChecked:boolean = true;
    MessageChecked:boolean = false;
    // checkEmailandMessage:boolean = false;
    // sendEmailCheck:boolean= true;

    sendMessageCheck:boolean = false;
    originAccountFollowUserEmail;
    unreadAssignNumber;

    constructor(
        private router: Router,
        private leadService: LeadService,
        private route: ActivatedRoute,
        private authService: AuthService,
        private dialogService: DialogService,
        private notesService : NotesService,
        private crmAssignmentService: CrmAssignmentService,
        private searchService: SearchService,
        private commonService: CommonService,
        private accountService: AccountService,
    ) {
        this.isLoading = true;
        //get initial value from router
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid'); //get company id from router
        this.filterType = this.route.snapshot.paramMap.get('type'); //filter type
        this.filterValue = this.route.snapshot.paramMap.get('value');// filter value
        // this.currentDateTime = new Date().valueOf();

        
        this.choiceValueCtrl = new FormControl(); // choiceValueCtrl is for select list to select type
        this.choiceValueCtrl.valueChanges.subscribe(
            (res) => {
                this.choiceValue = res;
                this.inputValueCtrl = new FormControl();
                // if (res == 'All') {   // if filter type = 'all' then refresh the page
                //     this.getCurrentCompanyUser();
                // }
            }
        )
        
        this.inputValueCtrl = new FormControl(); //inputValueCtrl is writing for get input value
        this.inputValueCtrl.valueChanges.subscribe(
            (res) => { this.inputValue = res; }
        )

        //for search employee to assign 
        this.emailCtrl = new FormControl();
        this.emailCtrl.valueChanges.subscribe(
            (term)=>{
                this.onSearchEmployee(term);
            }
        );

        if(this.filterType&&this.filterValue){
            this.choiceValue = this.filterType;
            this.inputValue = this.filterValue;
        }
    }


    ngOnInit() {
        //when return home clear the localstorage currentlogincompanyid
        setTimeout(() => {
            const cancelClick = document.getElementById('header-cancel');
            cancelClick.addEventListener("click", ()=>{
                this.clearServiceData();
            })
        }, 0);

        // console.log(this.leadService.currentPageCustomerList);
        this.getCurrentCompanyUser();
    }

     //get CurrentCompanyUser customers to check this employee position ('admin' or 'employee') in this company
     //if this user is admin or manager call getAdminLeadList();
     //if this user is employee call  getUserLeadList()
     getCurrentCompanyUser() {
        // console.log('beigin---');
        this.isLoading = true;
        this.authService.getCurrentUser().subscribe(
            res => {
                this.currentLoginUserInfo = res.user;
                this.currentLoginUserId = res.user.id;
                this.currentUserName = res.user.first_name + ' ' + res.user.last_name;
                this.currentCompanyUser = res.user.employed_companies.find(n => n.id == this.currentLoginCompanyId);

                if (this.currentCompanyUser.is_admin >= 1) {
                    // console.log('aaaaa');
                    this.getAdminLeadList();
                } else {
                    // console.log('aaaaabbb');
                    this.getEmployeeLeadList();
                }
            }
        )
    }

    adminGetCustomerListByFilterTypeAndFilterValue(filterType){
        this.leadService.searchCustomerByFieldName(this.currentLoginCompanyId, 'lead', this.filterValue, filterType).subscribe(
            res=>{
                this.leadlist$ = res.data;
                this.totalNumber = res.paging.total;
                this.next = res.paging.next;
                this.isLoading = false;
            },
            err=>{
                this.isLoading = false;
            }
        )
    }

    getAdminLeadList() {
        // console.log('admin');
        this.isLoading = true;
        if( this.filterType&&this.filterValue){
            if(this.filterType == 'CompanyName'){
                this.adminGetCustomerListByFilterTypeAndFilterValue('name');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead`,{type: 'CompanyName', value:this.inputValue}]);
            } else if(this.filterType == 'EmployeeName'){
                this.searchCustomerByEmployeeName(this.filterValue);
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead`,{type: 'EmployeeName', value:this.inputValue}]);
            }else if(this.filterType == 'Description'){
                this.adminGetCustomerListByFilterTypeAndFilterValue('description');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead`,{type: 'Description', value:this.inputValue}]);

            }else if(this.filterType == 'Website'){
                this.adminGetCustomerListByFilterTypeAndFilterValue('website');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead`,{type: 'Website', value:this.inputValue}]);

            }else if(this.filterType == 'Industry'){
                this.adminGetCustomerListByFilterTypeAndFilterValue('industry');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead`,{type: 'Industry', value:this.inputValue}]);

            }else if(this.filterType == 'CompanyEmail'){
                this.adminGetCustomerListByFilterTypeAndFilterValue('email');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead`,{type: 'CompanyEmail', value:this.inputValue}]);

            }else if(this.filterType == 'Memo'){
                this.adminGetCustomerListByFilterTypeAndFilterValue('memo');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead`,{type: 'Memo', value:this.inputValue}]);
            }else{
                this.isLoading = false;
            }

        }else{
            if(this.leadService.currentPageCustomerList.length>15){
                // console.log('getdata');
                // console.log(this.leadService.currentPageCustomerList);
                 this.leadlist$ = this.leadService.currentPageCustomerList;
                 this.next = this.leadService.nextpageUrl;
                 this.isLoading = false;
            }else{
                // console.log('adsf');
                this.adminRefresh();
            }
        }
    }


    adminGetCustomerByFilterValue(value) {
        this.isLoading = true;
        this.filterType = value;  
        this.filterValue = this.inputValue;
        this. getAdminLeadList();

    }

    normalUserGetCustomerByFilterValue(value) {
        this.isLoading = true;
        // this.inputValueCtrl = new FormControl();
        this.filterType = value;
        this.filterValue = this.inputValue;
        this.getEmployeeLeadList();
    }

    getCustomerByFilterValue(value){
        this.isLoading = true;
        this.refreshHeight= 400;
        if (this.currentCompanyUser.is_admin >= 1) {
            this.adminGetCustomerByFilterValue(value);
        } else {
            this.normalUserGetCustomerByFilterValue(value);
        }
    }

    //serarch customer by employee name
    searchCustomerByEmployeeName(value){
        this.refreshHeight = 400;
        this.leadService.getCustomerByEmployeeName(this.currentLoginCompanyId, 'lead', value).subscribe(
            res=>{
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead`,{type: 'EmployeeName', value:this.inputValue}]);
                this.leadlist$ = res.data;
                this.totalNumber = res.paging.total;
                this.next = res.paging.next;
                this.isLoading = false;
            }
        )
    }

    // user refresh data 
    // initial the paramter and according the parameter to get data
    refreshData(){
        this.isLoading = true;
        this.filterType = 'CompanyName';
        this.inputValue = '';
        this.filterValue= '';
        this.authService.getCurrentUser().subscribe(
            res => {
                this.currentLoginUserInfo = res.user;
                this.currentLoginUserId = res.user.id;
                this.currentCompanyUser = res.user.employed_companies.find(n => n.id == this.currentLoginCompanyId);
                if (this.currentCompanyUser.is_admin >= 1) {
                    this.adminRefresh();
                }else{
                    this.normalUserRefresh();
                }
            }
        )
    }

    //company admin or manager to refresh data
    adminRefresh(){
        // console.log('123');
        this.leadService.getAdminList(this.currentLoginCompanyId).subscribe(
            res => {
                this.leadlist$ = res.data;
                this.unreadAssignNumber = res.paging.unreadAssignCount;
                this.refreshHeight= 400;
                this.totalNumber = res.paging.total;
                this.isLoading = false;
                this.next = res.paging.next;
                this.leadService.nextpageUrl = res.paging.next;
                this.leadService.currentPageCustomerList =this.leadlist$;
                // console.log(this.leadlist$);
            },
            err=>{
                if(err.error.message.includes('Unknown column')){
                    let value = {
                        "emails":["info@orcasmart.com"],
                        "content":this.currentLoginCompanyId+ ' ' +  err.error.message,
                        "subject":"Database Maintain CRM Module"
                        }
                    this.commonService.sendEmialtoNoticeEmployee(value).subscribe(
                        res=>{

                        }
                    )
                    alert('Please contact Orcasmart DBA to maintain the database');
                }
                this.isLoading = false;
            }
        )
    }

    // company employee to refresh data
    normalUserRefresh(){
        // console.log('err');
        this.leadService.getLeadList(this.currentLoginCompanyId).subscribe(
            res => {
                this.refreshHeight= 400;
                this.leadlist$ = res.data;
                console.log(res.data);
                this.unreadAssignNumber = res.paging.unreadAssignCount;
                this.totalNumber = res.paging.total;
                this.next = res.paging.next;
                this.isLoading = false;
                this.leadService.nextpageUrl = res.paging.next;
                this.leadService.currentPageCustomerList =this.leadlist$;
            },
            err=>{
                if(err.error.message.includes('Unknown column')){
                    let value = {
                        "emails":["info@orcasmart.com"],
                        "content":this.currentLoginCompanyId+ ' ' +  err.error.message,
                        "subject":"Database Maintain CRM Module"
                        }
                    this.commonService.sendEmialtoNoticeEmployee(value).subscribe(
                        res=>{

                        }
                    )
                    alert('Please contact Orcasmart DBA to maintain the database');
                }
                this.isLoading = false;
            }
        )
    }


    // step forth, import AfterViewChecked, and implements AfterViewChecked
    // at ngAfterViewChecked() function, call backToLocation() function 
    // so that when you go back to the page, it will jump to the location that you scrolled previous automatically, editted by yali
    ngAfterViewChecked() {
        this.backToLocation();
    }

    // thrid step, get scroll_position from the local storage, and jump to the location
    backToLocation() {
        // second step, add id="content" at html at the location where the onMouseWheel function is called, editted by yali
        let content = document.getElementById('content');
        let scroll_position = +localStorage.getItem("scroll_position");
        if (content) {content.scrollTo({ top: scroll_position, left: 0, behavior: 'auto' });}
    }
  
    employeeGetCustomerListByFilterTypeAndFilterValue(filterType){
        this.leadService.normalUserSearchCustomerByFiledName(this.currentLoginCompanyId, 'lead', this.filterValue, filterType).subscribe(
            res=>{
                this.leadlist$ = res.data;
                console.log(this.leadlist$);
                this.totalNumber = res.paging.total;
                this.next = res.paging.next;
                this.isLoading = false;
            },
            err=>{
                this.isLoading = false;
            }
        )
    }


    getEmployeeLeadList() {

        this.isLoading = true;
        if( this.filterType&&this.filterValue){
            if(this.filterType == 'CompanyName'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('name');
            } 
            // else if(this.filterType == 'EmployeeName'){
            //     this.searchCustomerByEmployeeName(this.filterValue);
            // }
            else if(this.filterType == 'Description'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('description');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead`,{type: 'Description', value:this.inputValue}]);
            }else if(this.filterType == 'Website'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('website');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead`,{type: 'Website', value:this.inputValue}]);
            }else if(this.filterType == 'Industry'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('industry');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead`,{type: 'Industry', value:this.inputValue}]);

            }else if(this.filterType == 'CompanyEmail'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('email');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead`,{type: 'CompanyEmail', value:this.inputValue}]);
            }else if(this.filterType == 'Memo'){
                this.employeeGetCustomerListByFilterTypeAndFilterValue('memo');
                this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead`,{type: 'Memo', value:this.inputValue}]);
            }else{
                this.isLoading = false;
            }
        }else{
            if(this.leadService.currentPageCustomerList.length>15){
                 this.leadlist$ = this.leadService.currentPageCustomerList;
                 this.next = this.leadService.nextpageUrl;
                 this.isLoading = false;
            }else{
                // console.log('normal');
                this.normalUserRefresh();
            }
            
        }
        
    }

    //clear the service data and set scroll_position to 0
    clearServiceData(){
        this.leadService.currentPageCustomerList =[];
        this.leadService.nextpageUrl=  1;
        localStorage.setItem('scroll_position', '0');
    }

    // scroll to get more leads
    // store the scroll position in localstroage 
    onMouseWheel(evt) {
        localStorage.setItem('scroll_position', evt.target.scrollTop);
        if (evt.target.scrollTop > this.refreshHeight) {
            //get my next page of leads
            if (this.next != null){
                this.isDataLoading = true;
                this.refreshHeight = this.refreshHeight + 900;
                    this.leadService.getLeadListnext(this.next).subscribe(
                        res => {
                            this.leadList2 = res.data;
                            for (var i = 0; i < this.leadList2.length; i++) {
                                this.leadlist$.push(this.leadList2[i]);
                            }
                            this.leadService.currentPageCustomerList= this.leadlist$;
                            this.leadService.nextpageUrl = res.paging.next;
                            this.next = res.paging.next;
                            this.isDataLoading = false;
                        }, err => {
                            this.isLoading = false;
                        }
                    )
            }
        }
    }

    // get employee or customer full name
    getFullName(first_name, last_name) {
        return first_name + " " + last_name
    }

    // list bottom to active the bottom function
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
                return;}
            window.open(`mailto:${event.account.email}`);
        } else if (event.type == 'website') {
            if (!event.account.website) {
                this.dialogService.openAlertDialog('This account doesnt provide website.');
                return;}
            window.open(`http://${event.account.website}`, "_blank");
        } else if (event.type == 'notes') {
            this.router.navigate([`${event.account.id}/notes/notesSubject`], { relativeTo: this.route });
        } else if (event.type == 'quotes') {
            this.router.navigate([`${event.account.id}/salesentity/quote/draft`], { relativeTo: this.route });
        } else if(event.type =='assign'){
            this.originAccountFollowUserEmail = event.account.followed_by.email;
            this.NotifyContent =  this.currentUserName + ' assigned a new lead customer in CRM, name is ' +  "'" + event.account.name +  "'" + ', Please check it in account and contact the customer. ' + window.location.href + `/`+ event.account.id;
            this.assignModalOpen = true;
            this.assignmentList.push(event.account.id);
        }else if( event.type == 'contacts' ){
            this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/customer/${event.account.id}/contacts`]);
        }else if(event.type == 'status'){
            if(event.account.lead_status == 'Active'){
                event.account.lead_status = 'Inactive';
                this.leadService.changeCustomerStatus(this.currentLoginCompanyId, event.account.id, 'Inactive').subscribe(
                    res=>{}
                )
            }else if(event.account.lead_status == 'Inactive'){
                event.account.lead_status = 'Active';
                this.leadService.changeCustomerStatus(this.currentLoginCompanyId, event.account.id, 'Active').subscribe(
                    res=>{}
                )
            }else if(!event.account.lead_status){
                event.account.lead_status = 'Active';
                this.leadService.changeCustomerStatus(this.currentLoginCompanyId, event.account.id, 'Active').subscribe(
                    res=>{}
                ) 
            }
        }else if(event.type== 'evaluate'){
            if(event.account.evaluate =='good'){
                event.account.evaluate = 'bad';
                this.leadService.changeCustomerEvaluate(this.currentLoginCompanyId, event.account.id, 'bad').subscribe(
                    res=>{}
                )
            }else if(event.account.evaluate =='bad'){
                event.account.evaluate = 'good';
                this.leadService.changeCustomerEvaluate(this.currentLoginCompanyId, event.account.id, 'good').subscribe(
                    res=>{}
                )
            }else if(!event.account.evaluate){
                event.account.evaluate = 'good';
                this.leadService.changeCustomerEvaluate(this.currentLoginCompanyId, event.account.id, 'good').subscribe(
                    res=>{}
                )
            }
        }
    }


    onCancelAssign(){
        this.assignModalOpen = false;
        this.assignmentList = [];
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
            }
        )
        this.emailCtrl = new FormControl();
        this.emailCtrl.valueChanges.subscribe(
            (term)=>{
                this.onSearchEmployee(term);
            }
        )
        
    }
    // notify customer via emial with value
    notifyUserViaEmail(value){
        this.commonService.sendEmialtoNoticeEmployee(value).subscribe(
            res=>{}
        )
    };
    // notify customer via text message with value 
    notifyUserViaMessage(value){
        this.commonService.sendInviteNoticeToUSer(value).subscribe(
            res=>{}
        )
    };

    cancelNotifyMethod(){
        // this.checkEmailandMessage = false;
         this.getCurrentCompanyUser();
  }

    conformNotifyMethod(){
        // this.checkEmailandMessage = false;

        // if(this.sendEmailCheck){
        // this.sendEmailtoUser();
        // }
        if(this.sendMessageCheck){
            this.sendMessgaeToUser();
        }
        this.getCurrentCompanyUser();
    }
    // send email to invited user
    sendEmailtoUser(){
        let EmailValue = {
            "emails": [].push(this.selectAssignedUser.email),
            "content": this.currentLoginUserInfo.first_name+ ' ' + 'assign a new lead to you',
            "subject": 'New Customer',
        };
    //   this.commonService.sendBroadcastToCustomer(EmailValue).subscribe(
    //     res=>{
    //     }
    //   )
    }

sendMessgaeToUser(){
    // if(this.phoneNumberList.length>0){
    //   let SMSValue = {
    //     "phones":this.phoneNumberList,
    //     "content":"You got a new meeting from" + ' ' + this.projectOwnName + ", "+ "Subject name: " + this.meetingName + ". " + "Please login in http://bips.orcasmart.us to check!"
    //   }
    //     this.commonService.sendInviteNoticeToUSer(SMSValue).subscribe(
    //       res=>{
    //       }
    //     )
    // // }
    // } else {
    //   let message = this.emailList[this.i] + " does not save phone number in OrcaSmart, so we cannot send text message to this user!";
    //   this.dialogService.openAlertDialog(message).subscribe(
    //     res => {

    //     }
    //   )
    // }
  }
    // using for search company employee
    onSearchEmployee(value){
        this.searchService.searchCompanyEmployee(value, this.currentLoginCompanyId).subscribe(
            res=>{
                this.userEmailList = res;
            }
        )
    }
    // select company employee
    assignedUserSlected(value){
        this.selectAssignedUser = value;
        // console.log(value);
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
