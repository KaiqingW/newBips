import { Component,OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { VrmBaBaService } from '../../vrm.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { AuthService } from 'app/core/services/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, NgForm, ReactiveFormsModule, FormGroupDirective } from "@angular/forms";
import { NotesService } from 'app/core/services/notes.service';
import { CrmAssignmentService } from 'app/core/services/crm-assignment.service';
import { SearchService } from 'app/core/services/search.service';
import { CommonService } from 'app/core/services/common.service';

@Component({
    selector:"main-vendor",
    templateUrl: "main.component.html",
    styleUrls:["main.component.scss"]
})

export class MainComponent implements OnInit{
    mainVendorList;
    moreVendorList;
    currentLoginCompanyId;
    isLoading;
    isDataLoading;
    totalNumber;
    currentCompanyUser;
    //store next url to fetch more leads
    next:'';
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
    selectedVendorId;
    //for search customer
    adminChoices = ['CompanyName', 'EmployeeName','Description','Website','Industry','CompanyEmail','Memo'];
    normalChoices = ['CompanyName','Description','Website','Industry','CompanyEmail','Memo'];
    // initialType = this.choices[0];
    choiceValueCtrl: FormControl;
    inputValueCtrl: FormControl;
    choiceValue = 'CompanyName' ;
    inputValue;
    currentLoginUserId;
    originAccountFollowUserEmail;
    unreadAssignNumber;

    //assign user and send email or message
    NotifyContent = 'You have been assigned a new lead customer, Please contact the customers';
    EmailChecked:boolean = true;
    MessageChecked:boolean = false;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private vrmService : VrmBaBaService,
        private dialogService: DialogService,
        private authService: AuthService,
        private notesService : NotesService,
        private crmAssignmentService: CrmAssignmentService,
        private searchService: SearchService,
        private commonService:CommonService
    ){
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.isLoading = true;

        //for search employee to assign 
        this.emailCtrl = new FormControl();
        this.emailCtrl.valueChanges.subscribe(
            (term)=>{
                this.onSearchEmployee(term);
            }
        )

        this.initialSearchSetUp();
    }

    ngOnInit(){
        this.getCurrentCompanyUser();
    }

    getCurrentCompanyUser(){
        this.isLoading = true;
        this.authService.getCurrentUser().subscribe(
            res=>{
                this.currentLoginUserId = res.user.id;
                this.currentCompanyUser = res.user.employed_companies.find(n => n.id == this.currentLoginCompanyId);
                if (this.currentCompanyUser.is_admin >= 1) {
                    this.getAdminVendorList();
                } else {
                    this.getUserVendorList();
                }
            }
        )
    }

    getUserVendorList(){
        this.vrmService.getMainList(this.currentLoginCompanyId).subscribe(
            res=>{
                this.mainVendorList = res.data;
                this.next = res.paging.next;
                this.unreadAssignNumber = res.paging.unreadAssignCount;
                this.isLoading = false;
                this.totalNumber = res.paging.total;
                // console.log(this.totalNumber);
            }
        )
    }

    getAdminVendorList(){
        this.vrmService.getAdminList(this.currentLoginCompanyId,'main').subscribe(
            res=>{
                this.mainVendorList = res.data;
                this.totalNumber = res.paging.total;
                this.unreadAssignNumber = res.paging.unreadAssignCount;
                this.next = res.paging.next;
                this.isLoading = false;
            }
        )
    }

    // scroll to get more leads
    onMouseWheel(evt) {
        if(evt.target.scrollTop > this.refreshHeight){
            //get my next page of leads
            if(this.next !=null){
            this.isDataLoading = true;
            this.refreshHeight = this.refreshHeight + 900;
            this.vrmService.getVendorListNext(this.next).subscribe(
                res =>{
                    this.moreVendorList = res.data;
                    for (var i = 0; i< this.moreVendorList.length; i++){
                        this.mainVendorList.push(this.moreVendorList[i]);
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
            this.router.navigate([`${event.account.id}/salesentity/quote`], { relativeTo: this.route });
        } else if(event.type =='assign'){
            this.originAccountFollowUserEmail = event.account.followed_by.email;
            // console.log(event.account.id);
            this.assignModalOpen = true;
            this.assignmentList.push(event.account.id);
            // console.log(this.assignModalOpen);
        }
        else if( event.type == 'contacts' ){
           this.router.navigate([`/company/${this.currentLoginCompanyId}/vrm/vendor/${event.account.id}/contacts`]);
        }else if(event.type == 'status'){
            if(event.account.lead_status == 'Active'){
                event.account.lead_status = 'Inactive';
                this.vrmService.changeCustomerStatus(this.currentLoginCompanyId, event.account.id, 'Inactive').subscribe(
                    res=>{}
                )
            }else if(event.account.lead_status == 'Inactive'){
                event.account.lead_status = 'Active';
                this.vrmService.changeCustomerStatus(this.currentLoginCompanyId, event.account.id, 'Active').subscribe(
                    res=>{}
                )
            }else if(!event.account.lead_status){
                event.account.lead_status = 'Active';
                this.vrmService.changeCustomerStatus(this.currentLoginCompanyId, event.account.id, 'Active').subscribe(
                    res=>{}
                ) 
            }
        }else if(event.type== 'evaluate'){
            if(event.account.evaluate =='good'){
                event.account.evaluate = 'bad';
                this.vrmService.changeCustomerEvaluate(this.currentLoginCompanyId, event.account.id, 'bad').subscribe(
                    res=>{}
                )
            }else if(event.account.evaluate =='bad'){
                event.account.evaluate = 'good';
                this.vrmService.changeCustomerEvaluate(this.currentLoginCompanyId, event.account.id, 'good').subscribe(
                    res=>{}
                )
            }else if(!event.account.evaluate){
                event.account.evaluate = 'good';
                this.vrmService.changeCustomerEvaluate(this.currentLoginCompanyId, event.account.id, 'good').subscribe(
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
        // console.log(this.selectAssignedUser.id);
        // console.log(this.currentLoginCompanyId);
        // console.log(this.assignmentList);
        this.crmAssignmentService.assignToUser(this.currentLoginCompanyId, this.selectAssignedUser.id, {customers: this.assignmentList}).subscribe(
            res=>{
                this.vrmService.shareCustomer(this.currentLoginCompanyId,this.assignmentList[0], [this.originAccountFollowUserEmail]).subscribe(
                    res1 => {
                        this.assignmentList = [];
                });
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

                        console.log(this.selectAssignedUser.email);
                        this.notifyUserViaEmail(emailValue);
                    }else{
                        let emailValue = {
                            "emails":[this.selectAssignedUser.email],
                            "content":'You have been assigned a new lead customer, Please contact the customers',
                            "subject":"You have new Customers",
                        }
                        console.log(this.selectAssignedUser.email);
                        console.log(emailValue);

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

    onSearchEmployee(value){
        this.searchService.searchCompanyEmployee(value, this.currentLoginCompanyId).subscribe(
            res=>{
                this.userEmailList = res;
            }
        )
    }

    assignedUserSlected(value){
        this.selectAssignedUser = value;
        // console.log(value);
    }

    getCustomerByFilterValue(value) {
        this.isLoading = true;
        // this.inputValueCtrl = new FormControl();
        if(value == 'CompanyName'){
            this.vrmService.customerFilterByType(this.currentLoginCompanyId, 'main', 'name', this.inputValue).subscribe(
                res => {
                    // console.log(res);
                    this.mainVendorList = res.data;
                    this.totalNumber = res.paging.total;
                    this.next = res.paging.next;
                    this.isLoading = false;
                })
        } else if(value == 'EmployeeName'){
            this.searchCustomerByEmployeeName(this.inputValue);
        }else if(value == 'Description'){
            this.vrmService.searchCustomerByFieldName(this.currentLoginCompanyId, 'main', this.inputValue, 'description').subscribe(
                res=>{
                    this.router.navigate([`/company/${this.currentLoginCompanyId}/vrm/main-vendor`,{type: 'Description', value:this.inputValue}]);
                    this.mainVendorList= res.data;
                    this.totalNumber = res.paging.total;
                    this.next = res.paging.next;
                    this.isLoading = false;
                },
                err=>{
                    this.isLoading = false;
                }
            )
        }else if(value == 'Website'){
            this.vrmService.searchCustomerByFieldName(this.currentLoginCompanyId, 'main', this.inputValue, 'website').subscribe(
                res=>{
                    this.router.navigate([`/company/${this.currentLoginCompanyId}/vrm/main-vendor`,{type: 'Website', value:this.inputValue}]);
                    this.mainVendorList = res.data;
                    this.totalNumber = res.paging.total;
                    this.next = res.paging.next;
                    this.isLoading = false;
                }
            )
        }else if(value == 'Industry'){
            this.vrmService.searchCustomerByFieldName(this.currentLoginCompanyId, 'main', this.inputValue, 'industry').subscribe(
                res=>{
                    this.router.navigate([`/company/${this.currentLoginCompanyId}/vrm/main-vendor`,{type: 'Industry', value:this.inputValue}]);
                    this.mainVendorList = res.data;
                    this.totalNumber = res.paging.total;
                    this.next = res.paging.next;
                    this.isLoading = false;
                }
            )
        }else if(value == 'CompanyEmail'){
            this.vrmService.searchCustomerByFieldName(this.currentLoginCompanyId, 'main', this.inputValue, 'email').subscribe(
                res=>{
                    this.router.navigate([`/company/${this.currentLoginCompanyId}/vrm/main-vendor`,{type: 'CompanyEmail', value:this.inputValue}]);
                    this.mainVendorList = res.data;
                    this.totalNumber = res.paging.total;
                    this.next = res.paging.next;
                    this.isLoading = false;
                }
            )
        }else if(value == 'Memo'){
            this.vrmService.searchCustomerByFieldName(this.currentLoginCompanyId, 'main', this.inputValue, 'memo').subscribe(
                res=>{
                    this.router.navigate([`/company/${this.currentLoginCompanyId}/vrm/main-vendor`,{type: 'Memo', value:this.inputValue}]);
                    this.mainVendorList = res.data;
                    this.totalNumber = res.paging.total;
                    this.next = res.paging.next;
                    this.isLoading = false;
                }
            )
        }else{
            this.isLoading = false;
        }
    }
    //serarch customer by employee name
    searchCustomerByEmployeeName(value){
        this.refreshHeight = 400;
        this.vrmService.getCustomerByEmployeeName(this.currentLoginCompanyId, 'main', value).subscribe(
            res=>{
                this.mainVendorList= res.data;

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
        this.selectedVendorId = customer.id;
        if(customer.followed_by.id == this.currentLoginUserId){
            this.crmAssignmentService.deleteAssignAt(this.currentLoginCompanyId, customer.id ).subscribe(
                res=>{
                }
            )
        }
    }

}