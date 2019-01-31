import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'setting-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class SettingDashboardComponent implements OnInit {
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
        "broadcasturl": "assets/images/testimg/broadcast.png",
        "shopManagement": "assets/images/shop-management.png",
        "costanalysisurl": "assets/images/testimg/costanalysis.png",
        "businessMeeting": "assets/images/testimg/business-meeting.jpg",
        'opportunityurl': "assets/images/testimg/opportunity-icon.png",
        'crmassignmenturl': "assets/images/testimg/assignment-icon.jpg",
        "quoteCenterUrl": "assets/images/testimg/quotes.png",
    };
    
    constructor() {

    }

    ngOnInit() {

    }
}