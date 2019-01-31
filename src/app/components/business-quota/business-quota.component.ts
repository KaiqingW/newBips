import { Component, ViewChild, OnInit } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CompanyService } from 'app/core/services/company.service';
import { LeadService } from 'app/core/services/lead.service';
import { QuoteService } from 'app/core/services/quote.service';
import * as moment from 'moment';
import { AuthService } from 'app/core/services/auth.service';
import { SearchService } from 'app/core/services/search.service';
import { VrmBaBaService } from 'app/containers/vrm/vrm.service';

@Component({
    selector: 'business-quota',
    templateUrl: 'business-quota.component.html',
    styleUrls: ['business-quota.component.scss']
})

export class BusinessQuotaComponnet implements OnInit {

    @ViewChild(SignaturePad) signaturePad: SignaturePad;

    currentLoginCompanyId;
    // currentLoginUserInfo;
    currentLoginUserId;
    currentCompanyUser;
    currentCustomerId;
    isLoading;
    currentDate = new Date();
    quoteList;
    quoteListNext;
    quoteTotal;
    currentWholeUrl;
    showFilterModal = false;
    showPresetsModal: boolean = true;
    showCustomModal: boolean = false;
    startDate = '';
    endDate = '';
    lastField;
    defaultType = true;
    currentDay = this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDate();
    addSalesEntity;
    filterTimeStart;
    filterTimeEnd;
    filterValue;
    salesEntityTotalNumber;
    vendorId;

     //store next url to fetch more leads
     next: '';
     //count mouse wheel
     countMouseWheel = 0;
     // set naximum refresh height
     refreshHeight = 400;

     vendorCompanyId;

     quoteType='draft';
     salesorderType='new';
     invoiceType='Business Invoice'
     invoiceTypeList = ['Business Invoice', 'Shop Invoice', 'All'];
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private companyService: CompanyService,
        private leadService: LeadService,
        private quoteService: QuoteService,
        private authService: AuthService,
        private searchService: SearchService,
        private vrmBaBaService: VrmBaBaService
    ) {
        this.isLoading = true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid'); //get current login company id
        this.currentCustomerId = this.route.snapshot.paramMap.get('cusid'); //get current customer id, cusid means crm customer id
        //check customer exist or not 
        if (!this.currentCustomerId) {
            this.currentCustomerId = this.route.snapshot.paramMap.get('ven_id'); //if no crm customer id,  then equal to vendor id
            this.vendorId = this.route.snapshot.paramMap.get('ven_id'); //get current vendor id
        }
        console.log('customer id : ' + this.currentCustomerId);
        console.log('vendor id' + this.vendorId);
        this.currentWholeUrl = document.URL;  //get the whole url of this page
        this.addSalesEntity = this.route.snapshot.data.title;  // get salesentity type: quote, salesorder, account; will decide to add type
        // this.route.snapshot.data.nextUrl = `/dashboard`
        // console.log(this.route.snapshot.data);
    }

    ngOnInit() {
        //according to Router loading different salesEntity
        this.salesEntityLoading();
        // this.getCurrentCompanyUser();
    }

    // with customer id or vendor id call this function
    salesEntityLoading() {
        if(this.vendorId){
            console.log('vendor id')
            console.log(this.vendorId);
            console.log( this.currentLoginCompanyId);
            //get current vendor salesentity information
            this.vrmBaBaService.getVendor(this.currentLoginCompanyId, this.vendorId).subscribe(
                res=>{
                    //get this vendor's name in orca, if this vendor not exist get null
                    this.vendorCompanyId = res.company_id;
                    if(this.vendorCompanyId){
                        // console.log('this vendor had company in orca');
                    }
                    this.authService.getCurrentUser().subscribe(
                        res=>{
                            // this.currentLoginUserInfo = res.user;
                            this.currentLoginUserId = res.user.id;
                            this.currentCompanyUser = res.user.employed_companies.find(n => n.id == this.currentLoginCompanyId);
                            let CurrentLoginCompanyName = this.currentCompanyUser.name; //current login company name
                            //using vendor company id and current login company id to search the same name customer id in that company
                            this.searchService.searchCRMCompanyWithoutId(this.vendorCompanyId, CurrentLoginCompanyName).subscribe(
                                res=>{
                                    let customerid = res.data[0].id;
                                    //get the salesentity with the customer id in vendor company database;
                                    //  this required your current login company should be add in vendor company crm system
                                    this.quoteService.getQuotesByVendor( this.vendorCompanyId, customerid).subscribe(
                                        res=>{
                                            console.log(this.vendorCompanyId);
                                            this.quoteList = res.data;
                                            this.isLoading = false;
                                            this.next = res.paging.next;
                                            this.salesEntityTotalNumber = res.paging.total;
                                            // console.log(res);
                                        }
                                    )
                                }
                            )
                        }
                    )
                }
            )
        }else if(this.currentCustomerId&&!this.vendorId){
            console.log('customer id and no vendor id');
            // console.log('this is crm to get salesentity infomation');
            if (this.currentWholeUrl.toLowerCase().includes('quote')) {
                this.normalUserGetQuoteListWithCustomerId(); //get current company quotes information
            }
            if (this.currentWholeUrl.toLowerCase().includes('salesorder')) {
                this.normalUserGetSalesOrderListWithCustomerId();
                // this.getSalesOrders();   //get current company salesorder information
            }
            if (this.currentWholeUrl.toLowerCase().includes('invoice')) {
                console.log('crms');
                this.getInvoices();  //get current company invoice information
            }
        }else{
            this.getCurrentCompanyUser(); 
            console.log('center????'); //if no currentCustomerId and vendor id call this function, means quote center
        }
    }

    getCurrentCompanyUser(){
        // console.log(this.route.snapshot);
        this.authService.getCurrentUser().subscribe(
            res=>{
                // this.currentLoginUserInfo = res.user;
                this.currentLoginUserId = res.user.id;
                this.currentCompanyUser = res.user.employed_companies.find(n => n.id == this.currentLoginCompanyId);
                if(this.route.snapshot.data.title =="Quotes"){
                    if(res.user.id == 1){
                        console.log("admin quote");
                        this.adminGetQuoteCenterList(); //admin to see all employees' quotes in this company
                    }
                    console.log('normal user quote');
                    this.normalUsergetQuoteCenterList();  //normal employee get self all cutomers' quote in this company 
                }else if(this.route.snapshot.data.title =="SalesOrders"){
                    this.normalUsergetSalesorderCenterList();
                    console.log('normal user salesorder');
                }else if(this.route.snapshot.data.title =="Invoices"){
                    this.normalUsergetInvoicesCenterList(this.invoiceType);
                    console.log('normal user invoice');
                }
            }
        )

    }

    onMouseWheel(evt){
        // console.log(evt);
        if(evt.target.scrollTop > this.refreshHeight){
            // console.log(400);
            if(this.next != null){
                // console.log(this.next);
                this.isLoading = true;
                this.refreshHeight = this.refreshHeight + 900;
                // console.log('more');
                this.quoteService.getQuoteListByUrl(this.next).subscribe(
                    res=>{
                        this.quoteListNext = res.data;
                        for(var i = 0; i<this.quoteListNext.length; i++){
                            this.quoteList.push(this.quoteListNext[i]);
                        }
                        this.next = res.paging.next;
                        this.isLoading =false;
                    }, err=>{
                        this.isLoading = false;
                    }
                )
            }

        }

    }
    //get quotes;
    getQuotes() {
        this.quoteService.getQuoteList(this.currentLoginCompanyId, this.currentCustomerId).subscribe(
            res => {
                this.quoteList = res.data;
                // console.log(res);
                this.next = res.paging.next;
                this.quoteTotal = res.paging.total;
                this.isLoading = false;
            }
        )
    }
    //get salesOrders
    getSalesOrders() {
        this.quoteService.getSalesOrderList(this.currentLoginCompanyId, this.currentCustomerId).subscribe(
            res => {
                this.quoteList = res.data;
                this.isLoading = false;
            }
        )
    }
    //get Invoices
    getInvoices() {
        this.quoteService.getInvoiceList(this.currentLoginCompanyId, this.currentCustomerId).subscribe(
            res => {
                this.quoteList = res.data;
                this.isLoading = false;
            }
        )
    }


    // convert timr to unix Time as salesEntity Number 
    convertUnixCode(value) {
        return new Date(value).getTime() / 1000;
        // return new Date(value).valueOf() / 1000;
    }

    //caculate the progress 
    getPosibility(value) {
        const createTime = this.convertUTCDateToLocalDate(new Date(value)).toLocaleString();
        if ((new Date(this.currentDate).getTime() - new Date(createTime).getTime()) / (30 * 24 * 60 * 60 * 1000) <= 1) {
            return ((new Date(this.currentDate).getTime() - new Date(createTime).getTime()) / (30 * 24 * 60 * 60 * 1000))
        } else {
            return 1;
        }
    }

    // convert utc to local time
    convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60);
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
        newDate.setHours(hours - offset);
        return newDate;
    }

    //show the filter div and refresh the data
    showFilter() {
        if (this.showFilterModal) {
            this.isLoading = true;
            this.filterValue = '';
            this.salesEntityLoading();
            this.filterTimeStart = null;
            this.filterTimeEnd = null;
        }
        this.showFilterModal = !this.showFilterModal;
    }

    //close the filter div
    closeFilterModal() {
        this.showFilterModal = false;
    }
    // filter by quote number,create time and total value
    multiFilter(fname) {
        if (!this.lastField) {
            this.lastField = fname;
        }
        if (this.lastField == fname) {
            this.isLoading = true;
            let ftype = '';
            if (this.defaultType) {
                ftype = 'asc'
            } else {
                ftype = 'desc'
            }
            this.quoteService.salesEntityFilter(this.currentLoginCompanyId, this.currentCustomerId, fname, ftype, this.filterTimeStart, this.filterTimeEnd).subscribe(
                res => {
                    this.quoteList = res;
                    this.isLoading = false;
                }
            )

            this.defaultType = !this.defaultType;
        } else {
            this.isLoading = true;
            const ftype = 'desc';
            this.lastField = fname;
            this.quoteService.salesEntityFilter(this.currentLoginCompanyId, this.currentCustomerId, fname, ftype, this.filterTimeStart, this.filterTimeEnd).subscribe(
                res => {
                    this.quoteList = res;
                    this.isLoading = false;
                }
            )
            this.defaultType = true;
        }

    }

    //filter by different time range including reset range and custom range
    filterByTime(value) {
        this.isLoading = true;
        switch (value) {
            case 'today':
                this.quoteService.quoteSearchByTime(this.currentLoginCompanyId, this.currentCustomerId, this.currentDay, this.currentDate).subscribe(
                    res => {
                        this.filterValue = 'Today';
                        this.quoteList = res;
                        this.isLoading = false;
                        this.filterTimeStart = this.currentDay;
                        this.filterTimeEnd = this.currentDate;
                    }
                );
                break;
            case 'yesterday':
                this.quoteService.quoteSearchByTime(this.currentLoginCompanyId, this.currentCustomerId, this.yesterdayBegin(), this.currentDay).subscribe(
                    res => {
                        this.filterValue = 'Yesterday';
                        this.quoteList = res;
                        this.isLoading = false;
                        this.filterTimeStart = this.yesterdayBegin();
                        this.filterTimeEnd = this.currentDay;
                    }
                )
                break;
            case 'lastweek':
                this.quoteService.quoteSearchByTime(this.currentLoginCompanyId, this.currentCustomerId, this.lastweekbegin(), this.lastweekend()).subscribe(
                    res => {
                        this.filterValue = 'Last Week';
                        this.quoteList = res;
                        this.isLoading = false;
                        this.filterTimeStart = this.lastweekbegin();
                        this.filterTimeEnd = this.lastweekend();
                    }
                );
                break;
            case 'lastmonth':
                this.quoteService.quoteSearchByTime(this.currentLoginCompanyId, this.currentCustomerId, this.lastmonthbegin(), this.lastmonthend()).subscribe(
                    res => {
                        this.filterValue = 'Last Month';
                        this.quoteList = res;
                        this.isLoading = false;
                        this.filterTimeStart = this.lastmonthbegin();
                        this.filterTimeEnd = this.lastmonthend();
                    }
                );
                break;
            case 'weektodate':
                this.quoteService.quoteSearchByTime(this.currentLoginCompanyId, this.currentCustomerId, this.weektodate(), this.currentDate).subscribe(
                    res => {
                        this.filterValue = 'Week to Date';
                        this.quoteList = res;
                        this.isLoading = false;
                        this.filterTimeStart = this.weektodate();
                        this.filterTimeEnd = this.currentDate;
                    }
                );
                break;
            case 'monthtodate':
                this.quoteService.quoteSearchByTime(this.currentLoginCompanyId, this.currentCustomerId, this.monthtodate(), this.currentDate).subscribe(
                    res => {
                        this.filterValue = 'Month to Date';
                        this.quoteList = res;
                        this.isLoading = false;
                        this.filterTimeStart = this.monthtodate();
                        this.filterTimeEnd = this.currentDate;
                    }
                );
                break;
            case 'quartertodate':
                this.quoteService.quoteSearchByTime(this.currentLoginCompanyId, this.currentCustomerId, this.weektoquarter(), this.currentDate).subscribe(
                    res => {
                        this.filterValue = 'Quarter to Date';
                        this.quoteList = res;
                        this.isLoading = false;
                        this.filterTimeStart = this.weektoquarter();
                        this.filterTimeEnd = this.currentDate;
                    }
                );
                break;
            case 'yeartodate':
                this.quoteService.quoteSearchByTime(this.currentLoginCompanyId, this.currentCustomerId, this.yeartodate(), this.currentDate).subscribe(
                    res => {
                        this.filterValue = 'Year to Date';
                        this.quoteList = res;
                        this.isLoading = false;
                        this.filterTimeStart = this.yeartodate();
                        this.filterTimeEnd = this.currentDate;
                    }
                );
                break;
            case 'custom':
                this.quoteService.quoteSearchByTime(this.currentLoginCompanyId, this.currentCustomerId, this.customStartDate(), this.customEndDate()).subscribe(
                    res => {
                        this.filterValue = 'custom';
                        this.quoteList = res;
                        this.isLoading = false;
                        this.filterTimeStart = this.customStartDate();
                        this.filterTimeEnd = this.customEndDate();
                    }
                );
                break;
        }
        this.showFilterModal = false;

    }

    getFullName(first_name, last_name) {
        return first_name + " " + last_name
    }

    //format the 
    createTime(value) {
        return moment(value).format("YYYY-MM-DD");
    }
    //show preset div
    showPresets() {
        this.showPresetsModal = true;
        this.showCustomModal = false;
    }
    //show custom div
    showCustom() {
        this.showPresetsModal = false;
        this.showCustomModal = true;
    }

    //generate preset time begin

    yesterdayBegin() {
        return moment(this.currentDate).subtract(1, 'day').format("YYYY-MM-DD");
    }

    lastweekbegin() {
        return moment(this.currentDate).subtract(7, 'days').startOf('week').format("YYYY-MM-DD");
    }
    lastweekend() {
        return moment(this.currentDate).subtract(7, 'days').endOf('week').format("YYYY-MM-DD");
    }

    lastmonthbegin() {
        return moment(this.currentDate).subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    }
    lastmonthend() {
        return moment(this.currentDate).startOf('month').format("YYYY-MM-DDTHH:mm:ss[Z]");
    }
    weektodate() {
        return moment(this.currentDate).startOf('week').format("YYYY-MM-DD");
    }
    weektoquarter() {
        return moment(this.currentDate).startOf('quarter').format("YYYY-MM-DD");
    }
    monthtodate() {
        return moment(this.currentDate).startOf('month').format("YYYY-MM-DD");
    }
    yeartodate() {
        return moment(this.currentDate).startOf('year').format("YYYY-MM-DD");
    }
    //generate preset time end

    //generate custome time
    customStartDate() {
        return moment(this.startDate).startOf('day').format("YYYY-MM-DD");
    }
    customEndDate() {
        return moment(this.endDate).add(1, 'day').endOf('day').format("YYYY-MM-DD");
    }

    //get quote center list
    normalUsergetQuoteCenterList(){
        if (this.currentWholeUrl.toLowerCase().includes('draft')) {
            this.quoteType = 'draft';
            console.log( this.quoteType);
            this.normalUserGetSalesEntityWithTypeAndStatus('quote', '');
        }

        if (this.currentWholeUrl.toLowerCase().includes('processing')) {
            this.quoteType = 'processing';
            // console.log( this.quoteType);
            this.normalUserGetSalesEntityWithTypeAndStatus('quote', 'NeedApproved');
        }

        if (this.currentWholeUrl.toLowerCase().includes('send')) {
            this.quoteType = 'send';
            // console.log( this.quoteType);
            this.normalUserGetSalesEntityWithTypeAndStatus('quote', 'Send');
        } 
    }

        //get quote center list
        normalUsergetSalesorderCenterList(){
            console.log('this is for center');
            if (this.currentWholeUrl.toLowerCase().includes('new')) {
                this.salesorderType = 'new';
                // console.log( this.quoteType);
                this.normalUserGetSalesEntityWithTypeAndStatus('salesorder', '');
            }
            if (this.currentWholeUrl.toLowerCase().includes('confirmed')) {
                this.salesorderType = 'confirmed';
                // console.log( this.quoteType);
                this.normalUserGetSalesEntityWithTypeAndStatus('salesorder', 'Confirmed');
            }
            if (this.currentWholeUrl.toLowerCase().includes('pickedup')) {
                this.salesorderType = 'pickedup';
                // console.log( this.quoteType);
                this.normalUserGetSalesEntityWithTypeAndStatus('salesorder', 'PickedUp');
            } 
            if (this.currentWholeUrl.toLowerCase().includes('delivered')) {
                this.salesorderType = 'delivered';
                // console.log( this.quoteType);
                this.normalUserGetSalesEntityWithTypeAndStatus('salesorder', 'Delivered');
            } 
        }


        getInvoiceType(value){
            console.log(value);
            this.isLoading = true;
            this.normalUsergetInvoicesCenterList(value);
        }
    
        normalUsergetInvoicesCenterList(value){
            if(value == "Business Invoice"){
                this.invoiceType = "Business Invoice";
                this.normalUserGetSalesEntityWithTypeAndStatus('invoice', '');
            }else if(value == "Shop Invoice") {
                this.invoiceType = "Shop Invoice";
                this.normalUserGetSalesEntityWithTypeAndStatus('shopinvoice', '');
                console.log('get all shop invoice');
            }else if(value == "All"){
                this.invoiceType = "All";
                this.quoteService.getNormalUserAllInvoices(this.currentLoginCompanyId).subscribe(
                    res=>{
                        console.log(res);
                        this.quoteList = res.data;
                        this.isLoading = false;
                        this.next = res.paging.next;
                        this.salesEntityTotalNumber = res.paging.total;
                        console.log(this.salesEntityTotalNumber);
                    }
                )
                console.log('should list all type invoice');
            }
        }



    normalUserGetSalesEntityWithTypeAndStatus(type, status){
        this.quoteService.quoteCenterGetList(this.currentLoginCompanyId, type, status).subscribe(
            res=>{
                this.quoteList = res.data;
                this.isLoading = false;
                this.next = res.paging.next;
                this.salesEntityTotalNumber = res.paging.total;
                console.log(this.salesEntityTotalNumber);
            }
        )

    }

    normalUserGetQuoteListWithCustomerId(){
        if (this.currentWholeUrl.toLowerCase().includes('draft')) {
            this.quoteType = 'draft';
            // console.log( this.quoteType);
            this.normalUserGetSalesEntityWithTypeAndStatusWithCustomerId('quote', '');
        }

        if (this.currentWholeUrl.toLowerCase().includes('processing')) {
            this.quoteType = 'processing';
            // console.log( this.quoteType);
            this.normalUserGetSalesEntityWithTypeAndStatusWithCustomerId('quote', 'NeedApproved');
        }

        if (this.currentWholeUrl.toLowerCase().includes('send')) {
            this.quoteType = 'send';
            // console.log( this.quoteType);
            this.normalUserGetSalesEntityWithTypeAndStatusWithCustomerId('quote', 'Send');
        }
    }

    normalUserGetSalesOrderListWithCustomerId(){
        console.log('salesorder');
        if (this.currentWholeUrl.toLowerCase().includes('new')) {
            this.salesorderType = 'new';
            console.log( this.quoteType);
            this.normalUserGetSalesEntityWithTypeAndStatusWithCustomerId('salesorder', '');
        }else if (this.currentWholeUrl.toLowerCase().includes('confirmed')) {
            this.salesorderType = 'confirmed';
            // console.log( this.quoteType);
            this.normalUserGetSalesEntityWithTypeAndStatusWithCustomerId('salesorder', 'Confirmed');
        }else if (this.currentWholeUrl.toLowerCase().includes('pickedup')) {
            this.salesorderType = 'pickedup';
            // console.log( this.quoteType);
            this.normalUserGetSalesEntityWithTypeAndStatusWithCustomerId('salesorder', 'PickedUp');
        }else if (this.currentWholeUrl.toLowerCase().includes('delivered')) {
            this.salesorderType = 'delivered';
            // console.log( this.quoteType);
            this.normalUserGetSalesEntityWithTypeAndStatusWithCustomerId('salesorder', 'Delivered');
        }else{
            this.isLoading = false;
        }
    }

    normalUserGetInvoiceListWithCustomerId(){
        console.log('invoice');
        if (this.currentWholeUrl.toLowerCase().includes('needinvoice')) {
            this.salesorderType = 'needinvoice';
            console.log( this.quoteType);
            this.normalUserGetSalesEntityWithTypeAndStatusWithCustomerId('invoice', '');
        }

        if (this.currentWholeUrl.toLowerCase().includes('invoiced')) {
            this.salesorderType = 'invoiced';
            // console.log( this.quoteType);
            this.normalUserGetSalesEntityWithTypeAndStatusWithCustomerId('invoice', 'NeedApproved');
        }

        if (this.currentWholeUrl.toLowerCase().includes('paid')) {
            this.salesorderType = 'paid';
            // console.log( this.quoteType);
            this.normalUserGetSalesEntityWithTypeAndStatusWithCustomerId('invoice', 'paid');
        }
    }

    normalUserGetSalesEntityWithTypeAndStatusWithCustomerId(type, status){
        this.quoteService.getQuoteWithCustomerIdTypeAndStatus(this.currentLoginCompanyId, this.currentCustomerId, type, status).subscribe(
            res=>{
                console.log(res);
                this.quoteList = res.data;
                this.isLoading = false;
                this.next = res.paging.next;
                this.salesEntityTotalNumber = res.paging.total;
                console.log(this.salesEntityTotalNumber);
            }
        )
    }

    adminGetQuoteCenterList(){
        
        if (this.currentWholeUrl.toLowerCase().includes('draft')) {
            this.adminGetSalesEntityWithTypeAndStatus('quote', '');
        }

        if (this.currentWholeUrl.toLowerCase().includes('processing')) {
            this.adminGetSalesEntityWithTypeAndStatus('quote', 'NeedApproved');
        }

        if (this.currentWholeUrl.toLowerCase().includes('send')) {
            this.adminGetSalesEntityWithTypeAndStatus('quote', 'Send');
        }
        
    }

    adminGetSalesEntityWithTypeAndStatus(type, status){
        this.quoteService.getAdminQuoteCenterList(this.currentLoginCompanyId, type, status).subscribe(
            res=>{
                this.quoteList = res.data;
                this.isLoading = false;
                this.next = res.paging.next;
                this.salesEntityTotalNumber = res.paging.total;
                // console.log(this.salesEntityTotalNumber);
                // console.log(res);
            }
        )
    }

    
    fixNumberQty(value, number){
        return parseFloat(value).toFixed(number)
    }


    
}