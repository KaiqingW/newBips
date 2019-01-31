import { Component } from '@angular/core';

@Component({
    selector:"appcenter",
    templateUrl:"appcenter.component.html",
    styleUrls:["appcenter.component.scss"]
})

export class AppCenterComponent{

    fakeUrl = {
        // "url":"assets/images/testimg/avatar_ex.jpg",
        // "crmurl": "assets/images/testimg/CRM_f.png",
        // "pourl":"assets/images/testimg/purchaseorder.png",
        // "inurl": "assets/images/testimg/inventory.png",
        // "scurl":"assets/images/testimg/showcase.png",
        // "seturl":"assets/images/testimg/company-setting.png",
        // "aeurl": "assets/images/testimg/add_employee.png",
        // "whurl":"assets/images/testimg/warehouse.png",
        // "vrmurl":"assets/images/testimg/VRM_logo.jpg",
        // "vrmurl2":"assets/images/testimg/vrm-2.png",
        // "vrmurl3":"assets/images/testimg/VRM_f1.png",
        // "todourl":"assets/images/testimg/todo.jpg",
        // "noteurl": "assets/images/testimg/note.jpg",
        // "mapurl": "assets/images/testimg/orcamap.png",
        "reporturl" : "assets/images/testimg/report.png",
        "appproduceurl":"assets/images/testimg/app-produce.png",
        "webproduceurl":"assets/images/testimg/web-pro.png",
        "orgcharturl" : "assets/images/testimg/orgchart.png",
        "logisticurl" : "assets/images/testimg/logistic.png",
        "hrurl" : "assets/images/testimg/hr.png",
        "financialurl" : "assets/images/testimg/financial.png",
        "forcasturl" : "assets/images/testimg/forcast.png",
        "businessruleurl" : "assets/images/testimg/businessrule.png",
        "social_medias" : "assets/images/testimg/social_medias.png",

        "Punch_system" : "assets/images/testimg/punch_system.png",
        "Traning_center" : "assets/images/testimg/Traning_center.png",
        "Video_system" : "assets/images/testimg/Video_system.png",
        "benefits_system" : "assets/images/testimg/benefits_system.png",
        "price_list" : "assets/images/testimg/price_list.png",
        "trucking" : "assets/images/testimg/trucking.png",
        "moments" : "assets/images/testimg/moments.png",
        "Filebox" : "assets/images/testimg/Filebox.png",
        "contact" : "assets/images/testimg/contact.png",
        "truck_route" : "assets/images/testimg/truck_route.png",
        "SMS" : "assets/images/testimg/sms.png",
        
        "calendar" : "assets/images/testimg/calendar.png",
        "StickyNotes" : "assets/images/testimg/StickyNotes.png",
        "Chat" : "assets/images/testimg/chat.png",
        "Weacher" : "assets/images/testimg/Weacher.png",
        "todourl":"assets/images/testimg/todo.jpg",
        "mapurl": "assets/images/testimg/orcamap.png",
    }

    note(){
        alert("coming soon ...");
    }

    apppro(){
        alert("we can help you to generate app, coming soon ...");
    }
    webpro(){
        alert("we can help you to generate web, coming soon ...");
    }
    commingSoon(){
        alert("coming soon...")
    }
}