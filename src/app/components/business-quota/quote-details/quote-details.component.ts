import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { QuoteService } from 'app/core/services/quote.service';
import { CompanyService } from 'app/core/services/company.service';
import { LeadService } from 'app/core/services/lead.service';
import { ImageService } from 'app/core/services/image.service';
import { AuthService } from 'app/core/services/auth.service';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Location } from '@angular/common';
import { BusinessNotesService } from 'app/core/services/business-notes.service';
// import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

declare let jsPDF: any;
declare var require: any;

@Component({
    selector:'quote-details',
    templateUrl:'quote-details.component.html',
    styleUrls:['quote-details.component.scss'],

})

export class QuoteDetailsComponent implements OnInit{
    @ViewChild('company') company: ElementRef;
    @ViewChild('shipTo') shipTo: ElementRef;
    @ViewChild('billTo') billTo: ElementRef;
    @ViewChild('date') date: ElementRef;
    @ViewChild('content2') content2: ElementRef;

    @ViewChild(SignaturePad) signaturePad: SignaturePad;
    
    currentLoginCompanyId;
    currentLoginUserId
    currentCompany;
    currentCustomerId;
    currentCustomer;
    currentSalesentity_id;
    currentQuote;
    isLoading;
    quoteTotalValue:number = 0;
    salesEntity;

    //for siganture
    sigUrl;
    showSigImg = false;
    signatureUrl = null;
    sigModal = true;
    signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
        'minWidth': 1,
        'canvasWidth': 300,
        'canvasHeight': 100
    };

    vendorId;
    currentQuoteStatus;
    sendOrRequest = 1;
    productList;
    showDeclineCommentModal = false;

    commentNoteForm: FormGroup;
    declineReason = false;
    noteSubjectId;
    vendorCompanyId; 


    constructor(
        private quoteService: QuoteService,
        private router: Router,
        private fb: FormBuilder, 
        private route: ActivatedRoute,
        private companyService: CompanyService,
        private leadService: LeadService,
        private imageService: ImageService,
        private authService: AuthService,
        private location: Location,
        private businessNotesService: BusinessNotesService
    ){
        //this is vendor company id is from orcasystem
        this.vendorCompanyId = this.route.snapshot.queryParamMap.get('vendorId');
        this.currentLoginCompanyId = this.route.snapshot.queryParamMap.get('vendorId');
        console.log(this.route);
        console.log(this.currentLoginCompanyId);
        console.log(this.vendorCompanyId);
        console.log(this.salesEntity);
        //if no vendor company get the value from self company id
        if(!this.currentLoginCompanyId){
            this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        }
        this.currentCustomerId = this.route.snapshot.paramMap.get('cusid');
        if(!this.currentCustomerId){
            this.currentCustomerId = this.route.snapshot.paramMap.get('ven_id');
        }
        this.currentSalesentity_id = this.route.snapshot.paramMap.get('seid');
        this.salesEntity = this.route.snapshot.data.title;
        console.log(this.salesEntity);
        this.isLoading = true;
    }

    ngOnInit(){
        this.getCurrentcompanyUser();
        
        this.quoteService.getQuote(this.currentLoginCompanyId, this.currentSalesentity_id ).subscribe(
            res=>{
                this.currentQuote= res;
                console.log(this.currentQuote);
                if(res.last_note){
                    this.noteSubjectId = res.last_note.id;
                console.log(this.noteSubjectId);
                }
                
                this.currentQuoteStatus = res.approve_status;
                console.log('123');
                this.currentCustomerId = res.customer_id;

                if(this.currentQuote.products.length){
                    for(let i = 0; i<this.currentQuote.products.length; i++){
                       this.quoteTotalValue = this.quoteTotalValue + this.currentQuote.products[i].quantity *  this.currentQuote.products[i].rate; 
                       this.sendOrRequest = this.sendOrRequest*this.currentQuote.products[i].approved;
                    }
                }
                console.log(this.currentQuoteStatus);
                console.log(this.sendOrRequest);
                this.companyService.getCompany(this.currentLoginCompanyId).subscribe(
                    res=>{
                        this.currentCompany = res;
                        // console.log(this.currentCompany);
                        this.leadService.getLead(this.currentLoginCompanyId,this.currentCustomerId).subscribe(
                            res=>{
                                this.currentCustomer = res;
                                // console.log(this.currentCustomer);
                                this.isLoading= false;
                            }
                        )
                        
                    }
                );
            }
        );
    }
    

    approveQuoteAndSigned(){
        this.isLoading = false;
        let value = {
            'signature': this.signatureUrl,
            'approve_status' : 'WaitingSend'
        }
        this.quoteService.editSalesEntity(this.currentLoginCompanyId, this.currentSalesentity_id, value).subscribe(
            res=>{
                this.isLoading = false;
                this.location.back();
            }
        )
    }

    requestApproved(value){
        console.log(value);
        if(value == 'Decline'){
            this.showDeclineCommentModal = true;
            this.createCommentForm();
        }else{
            this.quoteService.changeSalesentityStatus(this.currentLoginCompanyId, this.currentSalesentity_id, value).subscribe(
                res=>{
                    this.isLoading = false;
                    this.location.back();
                }
            )
        }
       
    }

    cancelDeclineModal(){
        this.showDeclineCommentModal = false;
    }

    createCommentForm(){
        this.commentNoteForm = this.fb.group({
          body: this.fb.array([
            this.initSubNote()
          ])
        });
      }
      
      initSubNote(){
        return this.fb.group({
            img: [''],
            text: ['']
        });
    }
    

    submitDeclineComment(value){
        console.log(value);
        this.declineReason = true;
        console.log(value.body[0].text);
        console.log(JSON.stringify(value.body));
        this.commentNoteForm.value.body = JSON.stringify(value.body);
        console.log(this.commentNoteForm.value);
        this.quoteService.changeSalesentityStatus(this.currentLoginCompanyId, this.currentSalesentity_id, 'Decline').subscribe(
            res=>{
                this.businessNotesService.addBusinessNotesNote(this.currentLoginCompanyId, this.noteSubjectId, this.commentNoteForm.value).subscribe(
                    res=>{
                        this.location.back();
                        console.log('add successful');
                    }
                )
            }
        )
        this.showDeclineCommentModal = false;
    }

    getNoteContent(desciption) {
        return JSON.parse(desciption);
    }

    getCurrentcompanyUser(){
        this.isLoading = true;
        this.authService.getCurrentUser().subscribe(
            res=>{
                this.currentLoginUserId = res.user.id;
                console.log(this.currentLoginUserId);
            }
        )
    }
    convertUnixCode(value){
        return new Date(value).valueOf()/1000;
    }

    fixNumberQty(value, number){
        return parseFloat(value).toFixed(number)
    }

    /////////////////////////////// signature begin/////////////////////////////
    ngAfterViewInit() {
        // this.signaturePad is now available
        this.signaturePad.set('minWidth', 1); // set szimek/signature_pad options at runtime
        this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
      }
     
      drawComplete() {
        // will be notified of szimek/signature_pad's onEnd event
        this.sigUrl = this.signaturePad.toDataURL();
     //    console.log(this.signaturePad.toDataURL());
        this.showSigImg = true;
        const formData = this.imageService.urltoFormData(this.signaturePad.toDataURL());
        this.imageService.uploadImage(formData).subscribe(
            res=>{
                console.log('finish signature');
                this.signatureUrl = res.url;
                console.log(res);
   
            }
        )
 
      }
     
      drawStart() {
        // will be notified of szimek/signature_pad's onBegin event
        console.log('begin drawing');
      }
 
      clearPad(){
         this.signaturePad.clear();
      }
 
      closePad(){
          this.sigModal = false;
      }
      openPad(){
         this.sigModal = true;
      }
      sigModel(){
         this.sigModal = true;
      }

 
 ////////////////////////////////////////////////signature end////////////////////////////////

    
    downloadPDF() {
        let jsPDF = require('jspdf');
        let doc = new jsPDF();

        // table
        let res = doc.autoTableHtmlToJson(document.getElementById("table_pdf"));
        // doc.autoTable(res.columns, res.data, {margin: {top: 80}});

        // var header = function(data) {
        //     doc.setFontSize(18);
        //     doc.setTextColor(40);
        //     doc.setFontStyle('normal');
        //     doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
        //     doc.text("Testing Report", data.settings.margin.left, 50);
        // };

        var options = {
            // beforePageContent: header,
            margin: {
            top: 115,
            left: 15,
            right: 15,
            },
            // startY: doc.autoTableEndPosY() + 115
        };

        doc.autoTable(res.columns, res.data, options);

        let specialElementHandlers = {
            '#editor': function(element, renderer) {
                return true;
            }
        };

        let company = this.company.nativeElement;
        let shipTo = this.shipTo.nativeElement;
        let billTo = this.billTo.nativeElement;
        let date = this.date.nativeElement;
        // let content2 = this.content2.nativeElement;

        doc.fromHTML(company.innerHTML, 15, 15, {
            'width': 60,
            'elementHandlers': specialElementHandlers
        });
        
        doc.fromHTML(shipTo.innerHTML, 113, 50, {
            'width': 60,
            'elementHandlers': specialElementHandlers
        });
        
        doc.fromHTML(billTo.innerHTML, 18, 50, {
            'width': 60,
            'elementHandlers': specialElementHandlers
        });

        doc.fromHTML(date.innerHTML, 40, 272, {
            'width': 60,
            'elementHandlers': specialElementHandlers
        });

        doc.fromHTML(date.innerHTML, 165, 23, {
            'width': 60,
            'elementHandlers': specialElementHandlers
        });

        doc.setFontSize(14);
        doc.text(155, 20, "Quote");
        doc.text(20, 46, "Bill To");
        doc.text(115, 46, "Ship To");
        doc.text(115, 262, "Total:");
        // doc.text(138, 75, "Due Date");
        // doc.text(138, 82, "Balance Due");
        doc.text(135, 262, "$ " + this.quoteTotalValue);
        
        doc.setFontSize(10);
        doc.text(122, 278, "Signature:");
        doc.text(20, 278, "Date:");
        doc.text(155, 25, "*Not an Invoice");
        doc.text(156, 29, "Date:");
        doc.text(140, 33, "Quote Number:");
        doc.text(166, 33, this.currentQuote.customer_id.toString());
        doc.text(22, 100, "Customer PO");
        doc.text(56, 100, "Shipping Method");
        doc.text(90, 100, "Terms");
        doc.text(124, 100, "Customer No.");
        doc.text(158, 100, "Account Rep");
        doc.text(22, 107, this.currentQuote.customer_number);
        doc.text(56, 107, this.currentQuote.shipping_method);
        doc.text(90, 107, this.currentQuote.payment_terms);
        doc.text(124, 107, this.currentQuote.customer_id.toString());
        doc.text(158, 107, this.currentQuote.rep);

        //currentCustomer
        doc.text(20, 75, "Account Name:");
        // doc.text(45, 75, this.currentCustomer.name);        
        doc.text(45, 75, this.currentCustomer.name);        
        doc.text(20, 82, "Contact Name:");
        // doc.text(45, 82, this.currentCustomer.name);
        doc.text(45, 82, this.currentCustomer.name);
        doc.text(120, 75, "Email:");
        if(this.currentCustomer.email){
            doc.text(132, 75, this.currentCustomer.email);
        }
        // doc.text(132, 75, "info@glopak.com");
        doc.text(120, 82, "Phone:");
        if(this.currentCustomer.fax_number){
            doc.text(132, 82, this.currentCustomer.fax_number);
        }
        // doc.text(132, 82, "5165251234");

        // due date
        // doc.rect(135, 70, 60, 14);
        // doc.line(135, 77, 195, 77);
        // doc.line(167, 70, 167, 84);


        // bill to
        // doc.rect(15, 40, 85, 30);
        // doc.line(15, 50, 100, 50);

        // ship to
        // doc.rect(110, 40, 85, 30);
        // doc.line(110, 50, 195, 50);

        // 6 col
        doc.rect(20, 95, 170, 14);
        doc.line(20, 102, 190, 102);

        //4 colume divider
        doc.line(54, 95, 54, 109);
        doc.line(88, 95, 88, 109);
        doc.line(122, 95, 122, 109);
        doc.line(156, 95, 156, 109);

        //5 colume divider
        // doc.line(48, 95, 48, 109);
        // doc.line(76, 95, 76, 109);
        // doc.line(104, 95, 104, 109);
        // doc.line(132, 95, 132, 109);
        // doc.line(160, 95, 160, 109);

        // 5 col
        doc.rect(15, 115, 180, 150);
        // doc.line(15, 125, 195, 125);
        doc.line(15, 255, 195, 255);
        
        // doc.line(45, 115, 45, 255);
        // doc.line(105, 115, 105, 255);
        // doc.line(135, 115, 135, 255);
        // doc.line(165, 115, 165, 255);
        doc.line(110, 255, 110, 265);
        
        //divide line
        doc.line(12, 90, 198, 90);


        // image
        // var img = new Image();
        // var imgData;
        // // img.crossOrigin = "Anonymous";
        // console.log(img.src);
        // img.onload = function(){
        //     // var dataURI = getBase64Image(img);
        //     var canvas = document.createElement("canvas");
        //     canvas.width = img.width;
        //     canvas.height = img.height;
        //     var ctx = canvas.getContext("2d");
        //     ctx.drawImage(img, 160, 265);
        //     console.log("1");
        //     imgData = canvas.toDataURL("image/png");
        //     console.log("1");
        //     console.log(imgData);
        //     // var dataURI = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        //     // setTimeout(() => {test = dataURL},15000);
        //     // return dataURL;

        // }
        // img.crossOrigin = "anonymous";
        // img.setAttribute('crossOrigin', 'anonymous');
        // img.src = this.currentQuote.singnature;

        // setTimeout(() => {console.log(imgData)},8000);
        // setTimeout(() => {doc.addImage(imgData, 'JPEG', 15, 40, 180, 160);doc.save('test.pdf');},3000);

        var img = new Image();
        var imgData;
        img.crossOrigin = "Anonymous";
        img.src = this.currentQuote.singnature;        
        // console.log(img.src);
        function toDataUrl(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                var reader = new FileReader();
                reader.onloadend = function() {
                    callback(reader.result);
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.responseType = 'blob';
            xhr.send();
        }

        toDataUrl(img.src, function(myBase64) {
            // console.log(myBase64); // myBase64 is the base64 string
            imgData = myBase64;
        });

        setTimeout(() => {
            doc.addImage(imgData, 'JPEG', 145, 265, 50, 20);
            // doc.output('test');
            doc.save('test.pdf');
        },1000);
        // console.log(imgData);
        // console.log(doc);
    }

     printFunction(){
        window.print()
     }

     customerApproveQuoteAndSigned(){
        //  console.log('customer approved this quote');
        this.isLoading = false;
        let value = {
            'account_signature': this.signatureUrl,
        }
        console.log(value);
        this.quoteService.editSalesEntity(this.vendorCompanyId, this.currentSalesentity_id, value).subscribe(
            res=>{
                this.isLoading = false;
                this.location.back();
            }
        )
     }

     customerDeclineQuote(){
         console.log('customer decline this quote');
     }

     generateSalesOrder(){
         this.isLoading = true;
         console.log(this.currentQuote);
         console.log('generate a slaesorder');
         this.quoteService.generateSalesOrderFromQuote(this.currentLoginCompanyId, this.currentQuote.id).subscribe(
             res=>{
                 this.isLoading = false;
                 this.location.back();
             }
         )
     }
   
}

