import { Component, OnInit, HostBinding,ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DialogService } from 'app/core/services/dialog.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { Lead, LeadService } from '../../../../../core/services/lead.service';
import { Address } from '../../../../../core/models/company';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddAttachmentComponent } from 'app/components/add-attachement/add-attachment.component';
import { AddCrmOpportunityComponent } from 'app/components/add-crm-opportunity/add-crm-opportunity.component';
import { AddProductComponent } from 'app/components/add-product/add-product.component';
import { CommonService } from 'app/core/services/common.service';
import { NotesService } from 'app/core/services/notes.service';
import { SearchService } from 'app/core/services/search.service';

@Component ({
    selector: "lead-detials",
    templateUrl: "lead-detials.component.html",
    styleUrls: ["lead-detials.component.scss"]
})


export class LeadDetialsComponent implements OnInit{
    
    Lead: Observable<Lead>;
    LeadName;
    currentLoginCompanyId;
    leadId;
    isLoading;
    companyContacts;
    companyAddresses;
    isShowMap:boolean = false;
    //attachment
    selectedAttachmentIndex: number;
    selectedProductAttachmentIndex:number;
    attachmentUrl = '' ;
    show;
    isPurchaseGoods = false;
    isProductInterested = true;
    isProductAttachment = false;
    modalOpen = false;
    productModalOpen = false;
    attachmentProductModalOpen = false;
    attachmentProductUrl;
    attachmentProductContent;
    attachemntProductCreateAt;
    prodcutSelectedType:string = 'Interested';
    fakeProductUrl = 'assets/images/bottle.png';
    fakeProductLists=[];
    userEmailList ;

    @ViewChild('crmgmap') gmapElement: any;

    map: google.maps.Map;
    infoWindows = [];
    markers : any[] = [];
    customerPrivateProducts;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: LeadService,
        private dialogService: DialogService,
        private toasterService: ToasterService,
        private dialog: MatDialog,
        private commonService: CommonService,
        private notesService : NotesService,
        private searchService: SearchService
    ){
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.leadId = this.route.snapshot.paramMap.get('cusid');
        this.isLoading = true;
    }

    ngOnInit(){
        this.service.getLead(this.currentLoginCompanyId,this.leadId).subscribe(
            res1=> {
                this.Lead = res1;
                this.LeadName = res1.name;
                // console.log(res1);
                // console.log(1232);
                this.service.getLeadContacts(this.currentLoginCompanyId,this.leadId).subscribe(
                    res2=>{
                       this.companyContacts = res2.data;
                    // console.log(this.companyContacts);
                    })
                this.service.getLeadAddresses(this.currentLoginCompanyId,this.leadId).subscribe(
                    res3=>{
                        this.companyAddresses = res3.data;
                        this.isLoading = false;
                    })
                this.getCustomerPrivateProductsByCustomerId();
            }
        )
    }

    convertLead(){
        this.dialogService.openSureDialog().subscribe(result =>{
            if(result){
                this.isLoading = true;
                this.service.convertLead(this.currentLoginCompanyId, this.leadId).subscribe(()=>{
                    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/crm/potential`).then(()=>{
                        this.toasterService.showToaster('Convert success','',3000);
                        this.isLoading = false;
                    })
                })
            }
        })
    }
    showMap(){
        this.isShowMap = !this.isShowMap;
        setTimeout(()=>{
            if (this.isShowMap == true) {
              this.setGoogleMap();
            }else{
                this.isShowMap == false;
            }
          },100);
       
    }

    addAttachementDialog(){
        const dialogRef = this.dialog.open(AddAttachmentComponent, {
          width:'700px',
          data:{
            company_id: this.currentLoginCompanyId,
            customer_id: this.leadId
          }
        });

        dialogRef.afterClosed().subscribe(
            result=>{
                if(result){
                    this.isLoading = true;
                    this.service.getLead(this.currentLoginCompanyId,this.leadId).subscribe(
                    res4=>{
                        this.Lead = res4;
                        this.isLoading = false;
                    })
                }
            }
        )
    }

    //add attachment change to opportunity
    addAttachementDialogForProduct(){
        // console.log('123');
        const dialogRef = this.dialog.open(AddAttachmentComponent, {
          width:'700px',
          data:{
            company_id: this.currentLoginCompanyId,
            customer_id: this.leadId,
            product: 1
          }
        });

        dialogRef.afterClosed().subscribe(
            result=>{
                if(result){
                    this.isLoading = true;
                    this.service.getLead(this.currentLoginCompanyId,this.leadId).subscribe(
                    res5=>{
                        this.Lead = res5;
                        this.isLoading = false;
                    })
                }
               
            }
        )
    }

    addOpportunityDialog(){
        // console.log('opportunity component');
        const dialogRef = this.dialog.open(AddCrmOpportunityComponent, {
            width: '700px',
            data:{
                company_id: this.currentLoginCompanyId,
                customer_id : this.leadId,
                customer_data : this.Lead
            }
        })
        // console.log(this.currentLoginCompanyId, this.leadId, this.LeadName);
        dialogRef.afterClosed().subscribe(
            result=>{
                if(result){
                    this.isLoading = false;
                    //get oppportunity list to refresh
                }
            }
        )
    }

    addInterestedProductDialog(){
        const dialogRef = this.dialog.open(AddProductComponent, {
          width:'700px',
          data:{
            company_id: this.currentLoginCompanyId,
            customer_id: this.leadId,
          }
        });

        dialogRef.afterClosed().subscribe(
            result=>{
                this.isLoading = true;
                this.service.getLead(this.currentLoginCompanyId,this.leadId).subscribe(
                res6=>{
                    this.Lead = res6;
                    this.isLoading = false;
                })
            }
        )
    }

    setGoogleMap(){
        this.markers = [];
        let lati, long, center;
        let defaultCenter = new google.maps.LatLng(37.6117784, -93.9646151);

        if(!this.companyAddresses || this.companyAddresses.length === 0){
            center = defaultCenter;
          } else {
            lati = this.companyAddresses[0].latitude;
            long = this.companyAddresses[0].longitude;
            center = new google.maps.LatLng(lati, long);
          }

        var mapProp = {
            center: center,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
  
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        var bounds = new google.maps.LatLngBounds();

        if(this.companyAddresses && this.companyAddresses.length){
            for (var i = 0; i < this.companyAddresses.length; i++){
                if(this.companyAddresses[i] && this.companyAddresses[i].latitude && this.companyAddresses[i].longitude){
                    
                    
                    let tempPoint = new google.maps.LatLng(
                        this.companyAddresses[i].latitude,
                        this.companyAddresses[i].longitude
                    )
                    let tempMarker = new google.maps.Marker({
                        position: tempPoint,
                        animation: google.maps.Animation.DROP,
                    });

            //set each info window
            let infowindow = new google.maps.InfoWindow({
                content: `
                <div style="width:250px !important;">
                    ${this.companyAddresses[i].street1},
                    ${this.companyAddresses[i].city},
                    ${this.companyAddresses[i].state},
                    ${this.companyAddresses[i].zipcode}
                </div>
                `
            });
            this.infoWindows.push(infowindow);
            tempMarker.setMap(this.map);
            // this.markers.push(tempMarker);
            bounds.extend(tempMarker.getPosition());
        //   this.selectInMap(this.infoWindows, this.markers, i, this.warehouses);
            //   this.markers.push(tempMarker);
            //   this.infoWindows[i].open(this.map, this.markers[i]);
                }
            }
        }
        this.map.fitBounds(bounds);
    }

    getIconImg(attachment){
        if(attachment.description){
          let type = attachment.description;
          if(type.includes('jpg') || type.includes('jpeg' )|| type.includes('png' || type.includes('image/'))){
            return attachment.url;
          } else if(type.includes('pdf')){
            return 'assets/images/icons/pdf.png';
          } else if(type.includes('word')){
            return 'assets/images/icons/word.png';
          } else if(type.includes('xml')){
            return 'assets/images/icons/excel.png';
          }
        }
          return 'assets/images/icons/unknow.png';
      }

    
    //certificate attachment
      onClickAttachment(attachment, index){
        this.selectedAttachmentIndex = index;
        this.modalOpen = true;
        if(attachment.description.includes('image')){
          this.show = 'image';
        } else {
           this.show = 'other';
          this.attachmentUrl = attachment.url;
          window.open(this.attachmentUrl, '_blank');
        }
      }
    //for product attachment
      onClickProductAttachment(attachment){
        this.attachmentProductModalOpen = true;
        this.attachemntProductCreateAt = attachment.updated.at;
        this.attachmentProductUrl = attachment.url;
        this.attachmentProductContent = attachment.name;
      if(attachment.description.includes('image')){
        this.show = 'image';
      } else {
         this.show = 'other';
        this.attachmentUrl = attachment.url;
        window.open(this.attachmentUrl, '_blank');
      }
    }

      closeModal(){
        this.modalOpen =false;
        this.productModalOpen = false;
        this.attachmentProductModalOpen = false;
      }

      caculate(){
          alert("coming soon......")
      }
      showPurchaseGoods(){
        this.isProductAttachment = false;
        this.isProductInterested = false;
        this.isPurchaseGoods = true;
        this.prodcutSelectedType = 'Purchased';
      }

      showProductInterested(){
        this.isPurchaseGoods = false;
        this.isProductAttachment = false;
        this.isProductInterested = true;
        this.prodcutSelectedType = 'Interested';
      }

      showProductAttachment(){
        this.isPurchaseGoods = false;
        this.isProductInterested = false;
        this.isProductAttachment = true;
        this.prodcutSelectedType = 'Attachment';
      }

    //for document 
    onReceivedFormData(fd){
        this.commonService.addAttachment(this.currentLoginCompanyId,this.leadId, fd).subscribe(
            (res) => {
                this.isLoading = false;
                this.service.getLead(this.currentLoginCompanyId,this.leadId).subscribe(
                    res1=> {
                        this.Lead = res1;
                    })
            },
            err => {
              console.log("upload attachment error");
            }
        )
    }

    getFullName(first_name, last_name){
        return first_name + " " + last_name;
    }

    onSearch(value){
        // this.imputUser = value;
        // console.log(value);
        this.notesService.getUserEmailList(value).subscribe(
             res=>{
                 this.userEmailList = res;
                //  console.log(this.userEmailList);
             }
         ) 
    }

    getCustomerPrivateProductsByCustomerId(){
        this.service.getPrivateProductsByCustomerId(this.currentLoginCompanyId, this.leadId).subscribe(
            res=>{
                this.customerPrivateProducts = res.data;
                console.log(this.customerPrivateProducts);
            }
        )
    }

   

}