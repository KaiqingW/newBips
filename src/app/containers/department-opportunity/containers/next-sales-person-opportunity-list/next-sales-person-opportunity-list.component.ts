import { Component, OnInit } from '@angular/core';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';
import { DialogService } from 'app/core/services/dialog.service';
import { CrmAssignmentService } from 'app/core/services/crm-assignment.service';
import { AccountService } from 'app/core/services/account.service';
import { CommonService } from 'app/core/services/common.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, NgForm, ReactiveFormsModule, FormGroupDirective } from "@angular/forms";
import { SearchService } from 'app/core/services/search.service';

@Component({
  selector: 'next-sales-person-opportunity-list',
  templateUrl: './next-sales-person-opportunity-list.component.html',
  styleUrls: ['./next-sales-person-opportunity-list.component.scss']
})
export class NextSalesPersonOpportunityListComponent implements OnInit {

  project;
  projectId;
  currentLoginCompanyId;
  isLoading;

  currUser_id;
  
  // ownerPermission is the permission of the owner of the project, because only owner can generate new meeting
  ownerPermission: boolean = false;

  // max num of share
  maxAdmin: number = 7;
  maxShare = [];
  currentUserCompany;
  isCompanyAdmin: boolean = false;

  // for assigning customer at opportunity
  originAccountFollowUserEmail;
  assignModalOpen:boolean = false;
  assignmentList= [];
  selectAssignedUser;
  NotifyContent = 'You have been assigned a new lead customer, Please contact the customers';
  EmailChecked:boolean = true;
  MessageChecked:boolean = false;
  emailCtrl : FormControl;
  userEmailList;
  // end

  projectListTotalUnread;

  constructor(
    private businessMeetingService: BusinessMeetingService,
    private route: ActivatedRoute,
    private router: Router,
    private authService : AuthService,    
    private departmentOpportunityService: DepartmentOpportunityService,
    private dialogService: DialogService,
    private crmAssignmentService: CrmAssignmentService,
    private accountService: AccountService,
    private commonService: CommonService,
    private searchService: SearchService,
    
  ) { 
    this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');    
    this.projectId = this.route.snapshot.paramMap.get('oppoPrevProjectId');
    this.isLoading = true;

    //for search employee to assign 
    this.emailCtrl = new FormControl();
    this.emailCtrl.valueChanges.subscribe(
        (term)=>{
            this.onSearchEmployee(term);
        }
    );

    
  }

  ngOnInit() {
      this.getCreatedProjectListtotalUnread();
    this.getProjextNextSubjectList();
  }

  // get the sales project with the next subject list
  getProjextNextSubjectList() {
    this.departmentOpportunityService.getSalesProjectWithPrevAttachAndNextSubjectList(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {
        this.project = res;

        console.log(this.project);
        
        this.isLoading = false;

        for (let i=0; i<this.project.next_meeting_subjects.length; i++) {
          this.maxShare[i] = (this.maxAdmin - this.project.next_meeting_subjects[i].sharedWithAdmin.length > 0) ? this.maxAdmin - this.project.next_meeting_subjects[i].sharedWithAdmin.length : 0;
        }

        // get the current logined user, check whether the user is the owner of the project
        // only the owner of the project can generate next meeting
        // if so, ownerPermission = true;
        this.authService.getCurrentUser().subscribe(
          res => {
            // currUser_id is the user's id in orcasmaer database
            this.currUser_id = res.user.id;

            this.currentUserCompany = res.user.employed_companies.find(n => n.id == this.currentLoginCompanyId);   
            // 1 has highest permission, who is the creater of the company
            // 2 is assigned admin of the company
            // both 1 and 2 is the admin of the company
            if (this.currentUserCompany.is_admin >= 1) {
              this.isCompanyAdmin = true;
            }

            // check whether the current user is owner of the project, if so, they can generate neew meeting
            let owners = this.project.owners;
            for (let i=0; i<owners.length; i++) {
              if (owners[i].user_id == this.currUser_id) {
                this.ownerPermission = true;
              }
            }
          }
        );       
        
      }
    )
  }

  // get the total unread of the project list that the current logined user has created as the sales.
  getCreatedProjectListtotalUnread() {
    this.departmentOpportunityService.getCreatedProjectListtotalUnread(this.currentLoginCompanyId, this.projectId).subscribe(
      res => {
        this.projectListTotalUnread = res;
        
        this.isLoading = false;
      }
    )
  }

  // for crm card, editted by yali
  getFullName(first_name, last_name) {
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
        this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead/${event.account.id}/notes/notesSubject`], { relativeTo: this.route });
    } else if (event.type == 'quotes') {
        this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/lead/${event.account.id}/salesentity/quote/draft`], { relativeTo: this.route });
    } else if(event.type =='assign'){
      // this.dialogService.openAlertDialog('coming soon ...');
      
        this.originAccountFollowUserEmail = event.account.followed_by.email;
        this.assignModalOpen = true;
        this.assignmentList.push(event.account.id);
    }else if( event.type = 'contacts' ){
        this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/customer/${event.account.id}/contacts`]);
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
                  this.getProjextNextSubjectList();
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
    if(customer.followed_by.id == this.currUser_id){
        this.crmAssignmentService.deleteAssignAt(this.currentLoginCompanyId, customer.id ).subscribe(
            res=>{
            }
        )
    }
  }
// end

  onReceivedFormData(fd){
      // let message = "You cannot upload attachement here. We will hide this function in the future!";          
      // this.dialogService.openAlertDialog(message);

      this.isLoading = true;
      this.businessMeetingService.addProjectAttachment(this.currentLoginCompanyId, this.projectId, fd).subscribe(
          (res) => {
              this.isLoading = false;
              this.getProjextNextSubjectList();
          },
          err => {
            this.isLoading = false;
            console.log("upload attachment error");
          }
      )
  }

  showDescription(){
    let message = JSON.parse(this.project.subject.description)[0].text;
    this.dialogService.openAlertDialog(message);
  }

}
