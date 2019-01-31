import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/core/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ContactService } from 'app/core/services/contact.service';
import { BusinessMeetingService } from 'app/core/services/business-meeting.service';
import { OrdersService } from '../../../../core/services/orders.service';
import { DialogService } from 'app/core/services/dialog.service';
import { DashBoardService } from 'app/core/services/dashboard.service';

// import opportunity subject id, editted by yali
import { DEPARTMENTOPPORTUNITYID } from 'app/core/data/department-opportunity-data';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';

@Component({
    selector: 'sales-dashboard',
    templateUrl: 'sales-dashboard.component.html',
    styleUrls: ['sales-dashboard.component.scss']
})

export class SalesDashboardComponent implements OnInit {

    currentLoginCompanyId;
    isLoading;
    currentUserCompany;
    currentUser;
    currentUserInCompany;
    currentCompanyUserLevel;
    currentUserName: any;
    showData: boolean = false;
    showChart: boolean = true;
    compzipcode;
    pendingOrderNum: number;
    businessMeetingUnread;

    departmentOpportunityId;
    salesOpportunityProjectId;

    // for opportunity, editted by yali
    currentUserId;
    opportunityPermission;
    // if the sales has not been assigned a project at opportunty by manager, salesOpportunityProjectPermission is false, show dialog
    // else route the sales' project page, editted by yali
    salesOpportunityProjectPermission;
    // if the current company does not have sales department opportunity, 
    // check whether the current user is the admin of the company
    // if so, show add page, else jump dialog
    // else if the company has already had sales department oppo, then check whether current user is the admin of the oppo
    hasSalesDepartmentOpportunity: boolean = false;
    dashboardData;

    // for opportunity unread, editted by yali
    subject;
    projectListTotalUnread = 0;
    sharedProjectList;
    // end

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private contactService: ContactService,
        private businessMeetingService: BusinessMeetingService,
        private ordersService: OrdersService,
        private departmentOpportunityService: DepartmentOpportunityService,
        private dialogService: DialogService,
        private dashboardService: DashBoardService
    ) {
        // get currentcompany id
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        if (!this.currentLoginCompanyId) {
            this.currentLoginCompanyId = localStorage.getItem("currentLoginCompanyId");
            if(!this.currentLoginCompanyId){
                this.router.navigate(['/home']);
            }
        }

        // get unread of business meeting 
        if(this.currentLoginCompanyId){
            this.getBusinessMeetingTotalUnread();
            this.getOrders();
        }




        // this.getDepartmentOpportunityId();
    }

    //change cookie to localStroge not use write 
    //     getCookie(cname){
    //         var name = cname + "=";
    //         var ca = document.cookie.split(';');
    //         for(var i=0; i<ca.length; i++) {
    //             var c = ca[i].trim();
    //             if (c.indexOf(name)==0) { 
    //                 return c.substring(name.length,c.length);
    //              }
    //     }
    //         return "";
    //   }

    
    commingSoon() {
        alert('comming soon!');
    }

    refresh() {
        window.location.reload(true);
    }
    ngOnInit() {

        // setTimeout(() => {
        //     const cancelClick = document.getElementById('header-cancel');
        //     cancelClick.addEventListener("click", ()=>{
        //         console.log('clear login company id');
        //         localStorage.setItem('currentLoginCompanyId', '0');
        //     })
        // }, 0);

        if (this.authService.getOrcaToken()) {
            this.authService.getCurrentUser().subscribe(
                data => {
                    this.currentUser = data.user;
                   
                    // used for opportunity, the id is the user_id at orcasmart database
                    // editted by yali
                    this.currentUserId = this.currentUser.id;
                    // get sales department opportunity
                    this.getSalesDepartmentOpportunity();

                    // end by yali

                    this.contactService.getContactbyUserId(this.currentLoginCompanyId, this.currentUser.id).subscribe(
                        res => {
                            this.currentUserInCompany = res;
                        }
                    )
                    this.currentUserCompany = data.user.employed_companies.find(n => n.id == this.currentLoginCompanyId);

                    // console.log(this.currentUserCompany.is_admin);
                    
                    if( this.currentUserCompany.is_admin >=1){
                        this.getAdminDashBoardData();
                    }else{
                        this.getDashBoardData();
                    };


                    if (this.currentUserCompany && this.currentUserCompany.address && this.currentUserCompany.address.zipcode) {
                        this.compzipcode = this.currentUserCompany.address.zipcode;
                        // console.log(this.compzipcode);
                    }
                    if (this.currentUserCompany && this.currentUserCompany.is_admin) {
                        this.currentCompanyUserLevel = this.currentUserCompany.is_admin;
                    }
                    this.currentUserName = this.currentUser.first_name + ' ' + this.currentUser.last_name;
                    this.isLoading = false;

                });
            err => {
                this.isLoading = false;
                setTimeout(() => {
                    const tagscroll = document.getElementById("scrollCard");
                    tagscroll.addEventListener("scroll", () => {
                    });
                }, 0);
            }
        } else {
            this.isLoading = false;
        }
    }

    // editted by yali
    // getDepartmentOpportunityId() {
    //     this.departmentOpportunityId = DEPARTMENTOPPORTUNITYID;
    // }

    getSalesDepartmentOpportunity() {
        this.departmentOpportunityService.getSalesDepartmentOpportunity(this.currentLoginCompanyId).subscribe(
            res => {
                console.log(res);
                if (res != null) {
                    this.departmentOpportunityId = res.id;
                    this.hasSalesDepartmentOpportunity = true;
                    this.getSubjectWithSharedUserList();

                } else {
                    this.hasSalesDepartmentOpportunity = false;
                }
            }
        )
    }

    getSubjectWithSharedUserList() {
        this.businessMeetingService.getSubjectWithSharedUserList(this.currentLoginCompanyId, this.departmentOpportunityId).subscribe(
            res => {
                console.log(res);

                // compare user_id
                let createrUserId = res.created.by.user_id;
                let sharedWithAdmin = res.sharedWithAdmin;

                if (this.currentUserId == createrUserId) {
                    this.opportunityPermission = "oppoAdmin";
                    this.getMainSubject();

                } else {
                    for (let i = 0; i < sharedWithAdmin.length; i++) {
                        if (this.currentUserId == sharedWithAdmin[i].user_id) {
                            this.opportunityPermission = "oppoAdmin";
                            this.getMainSubject();
                            break;
                        }
                    }

                    // if current user is not oppo admin, will route to sales opportunity list page
                    // go to backend to get the sales's oppo project
                    if (this.opportunityPermission != 'oppoAdmin') {

                        this.departmentOpportunityService.getSalesOpportunityProject(this.currentLoginCompanyId, this.departmentOpportunityId).subscribe(
                            res => {
                                // if the user does not have project at opportunity, jupm alert dialog
                                // else route to the project page
                                if (res != null) {
                                    this.salesOpportunityProjectPermission = true;
                                    this.salesOpportunityProjectId = res.id;
                                    this.getCreatedProjectListtotalUnread();
                                } else {
                                    this.salesOpportunityProjectPermission = false;
                                    this.getSharedProjectList();
                                }
                            }
                        )
                    }
                }
            }
        )
    }

    // get unread of opportunity for the admin of the opportunity, editted by yali
    getMainSubject() {
        this.departmentOpportunityService.getDepartmentOpportunitySubject(this.currentLoginCompanyId, this.departmentOpportunityId).subscribe(
            res => {        
                this.subject = res;        
                console.log(this.subject);
        
                // loop the projects of the subject, get the projectListUnread
                for (let i=0; i<this.subject.projects.length; i++) {
                    let tempProjectUnread = 0;
                    for (let j=0; j<this.subject.projects[i].next_meeting_subjects.length; j++) {
                        tempProjectUnread += this.subject.projects[i].next_meeting_subjects[j].unread_count;
                    }
                    
                    this.projectListTotalUnread += tempProjectUnread;
                }
        
                console.log(this.projectListTotalUnread);
                
                this.isLoading = false;
            }
        );
    }

    // get the total unread of the project list that the current logined user has created as the sales. editted by yali
    getCreatedProjectListtotalUnread() {
        this.departmentOpportunityService.getCreatedProjectListtotalUnread(this.currentLoginCompanyId, this.salesOpportunityProjectId).subscribe(
        res => {
            this.projectListTotalUnread = res;
            
            this.isLoading = false;
        }
        )
    }

    // for shared opportunity page, for angela kind of person
    // not admin , and not sales, editted by yali
    getSharedProjectList() {
        this.departmentOpportunityService.getSharedProjectList(this.currentLoginCompanyId).subscribe(
          res => {
            this.sharedProjectList = res.data.data;
            
            for (let i=0; i<this.sharedProjectList.length; i++) {
                this.projectListTotalUnread += this.sharedProjectList[i].unread_count;
            }

            console.log(this.projectListTotalUnread);
          }
        )
      }

    getDashBoardData(){
        this.dashboardService.getDashBoardData(this.currentLoginCompanyId).subscribe(
            res=>{
                this.dashboardData = res;
                // console.log(res);
            }
        )
    }

    getAdminDashBoardData(){
        this.dashboardService.getAdminDashBoardData(this.currentLoginCompanyId).subscribe(
            res=>{
                this.dashboardData = res;
            }
        )
    }

    showAlertDialog() {
        let message = "You have not been added to Opportunity. Please contact with your Manager.";
        this.dialogService.openAlertDialog(message);
    }

    showOppoSetupAlertDialog() {
        let message = "The Opportunity has not been set up. Please contact with your Manager.";
        this.dialogService.openAlertDialog(message);
    }

    getBusinessMeetingTotalUnread() {
        this.businessMeetingService.getCreatedAndSharedSubjectListUnread(this.currentLoginCompanyId).subscribe(
            res => {
                this.businessMeetingUnread = res;
            }
        )
    }
    // end by yali

    fakeUrl = {
        "url": "assets/images/testimg/avatar_ex.jpg",
        "crmurl": "assets/images/testimg/CRM_f.png",
        "pourl": "assets/images/testimg/purchaseorder.png",
        "inurl": "assets/images/testimg/inventory.png",
        "scurl": "assets/images/testimg/showcase.png",
        "seturl": "assets/images/testimg/company-setting.png",
        "aeurl": "assets/images/testimg/add_employee.png",
        "whurl": "assets/images/testimg/warehouse.png",
        "vrmurl": "assets/images/testimg/VRM_logo.jpg",
        "vrmurl2": "assets/images/testimg/vrm-2.png",
        "vrmurl3": "assets/images/testimg/VRM_f1.png",
        "Meeting": "assets/images/testimg/meeting.png",
        "noteurl": "assets/images/testimg/note.jpg",
        "mapurl": "assets/images/testimg/orcamap.png",
        "reporturl": "assets/images/testimg/report.png",
        "appproduceurl": "assets/images/testimg/app-produce.png",
        "webproduceurl": "assets/images/testimg/web-pro.png",
        "appcenterurl": "assets/images/testimg/app-center.png",
        "hrurl": "assets/images/testimg/hrlogo.png",
        "financialurl": "assets/images/testimg/financial1.png",
        "broadcasturl": "assets/images/testimg/email-blast.png",
        "shopManagement": "assets/images/shop-management.png",
        "costanalysisurl": "assets/images/testimg/costanalysis.png",
        "businessMeeting": "assets/images/testimg/business-meeting.jpg",
        "opportunityurl": "assets/images/testimg/opportunity-icon.png",
        "crmassignmenturl": "assets/images/testimg/batch-assign.png",
        "departmentOpportunity": "assets/images/testimg/department-opportunity.png",
        "quoteCenterUrl": "assets/images/testimg/quotes.png",
        "salesOrderUrl":"assets/images/testimg/salesorder.png",
        "invoiceUrl": "assets/images/testimg/invoice.png"

    }

    goAddEmployeeO() {
        this.router.navigate([`/company/${this.currentLoginCompanyId}/add-employee`, { currentCompanyUserLevel: this.currentCompanyUserLevel }]);
    }
    goAddEmployeeN() {
        this.router.navigate([`/company/${this.currentLoginCompanyId}/hr/employee`, { currentCompanyUserLevel: this.currentCompanyUserLevel }]);
    }

    showDataFun() {
        this.showData = true;
        this.showChart = false;
    }

    showChartFun() {
        this.showData = false;
        this.showChart = true;
    }

    task() {
        alert("coming soon ...");
    }
    note() {
        alert("coming soon ...");
    }

    apppro() {
        alert("we can help you to generate app, coming soon ...");
    }
    webpro() {
        alert("we can help you to generate web, coming soon ...");
    }
    try() {
    }


    getOrders() {
        this.ordersService.getOrders(this.currentLoginCompanyId, '').subscribe(
            res => {
                this.pendingOrderNum = res.paging.total;
            }
        )
    }

    // onReceiveImgUrl(event){
    //     console.log(event);
    // }

}
