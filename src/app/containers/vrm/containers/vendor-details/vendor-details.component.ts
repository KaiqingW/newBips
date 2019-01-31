import { Component, OnInit, HostBinding, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router'; 
import { DialogService } from 'app/core/services/dialog.service';
import { ToasterService } from 'app/core/services/toaster.service';
// import { } from '@types/googlemaps';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddAttachmentComponent } from 'app/components/add-attachement/add-attachment.component';
import { VrmBaBaService } from '../../vrm.service';
import { CompanyService } from 'app/core/services/company.service';
import { SearchService } from 'app/core/services/search.service';
import { CommonService } from 'app/core/services/common.service';


@Component({
    selector: 'vendor-details',
    templateUrl: "vendor-details.component.html",
    styleUrls: ['vendor-details.component.scss']
})

export class VendorDetailsComponent implements OnInit{
    Vendor;
    vendorName;
    vendorCompanyId;
    currentLoginCompanyId;
    currentVenderCompanyId;
    vendorId;
    isLoading;
    vendorContacts;
    vendorAddresses;
    isShowMap:boolean = false;
    productInterested;
    isPurchaseGoods = false;
    isProductInterested = true;
    isProductAttachment = false;
    productModalOpen = false;
    prodcutSelectedType:string = 'Interested';
    attachmentProductModalOpen = false;
    attachmentProductUrl;
    attachmentProductContent;
    attachemntProductCreateAt;
    //attachment
    selectedAttachmentIndex: number;
    attachmentUrl = '' ;
    show;
    modalOpen = false;
    fakeProductUrl = 'assets/images/bottle.png';
    fakeProductLists=[];
    
    @ViewChild('crmgmap') gmapElement: any;
    map: google.maps.Map;
    infoWindows = [];
    markers : any[] = [];
    vendorProducts;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dialogService: DialogService,
        private toasterService: ToasterService,
        private dialog: MatDialog,
        private vrmService : VrmBaBaService,
        private companyService: CompanyService,
        private searchService:SearchService,
        private commonService: CommonService
    ){
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.vendorId = this.route.snapshot.paramMap.get('ven_id');
        this.isLoading = true;
    }
    
    ngOnInit(){ 
        this.vrmService.getVendor(this.currentLoginCompanyId, this.vendorId).subscribe(
            res2=>{
                this.Vendor = res2;
                // console.log(this.Vendor );
                this.vendorName = this.Vendor.name;
                this.vendorCompanyId = this.Vendor.company_id;
                this.vrmService.getVendorContacts(this.currentLoginCompanyId,this.vendorId).subscribe(
                    res2=>{
                        this.vendorContacts = res2.data;
                    });
                this.vrmService.getVendorAddresses(this.currentLoginCompanyId, this.vendorId).subscribe(
                    res3=>{
                        this.vendorAddresses = res3.data;
                        this.isLoading = false;
                    })
                this.vrmService.getPrivateProductsByVendorId(this.currentLoginCompanyId, this.vendorId).subscribe(
                    res4=>{
                        this.vendorProducts = res4.data;
                        console.log('----------------------------------');
                        console.log(res4);
                    }
                )
                this.companyService.searchCompany(this.vendorName).subscribe(
                    res=>{
                        if(res.data.length){
                            const company_id = res.data[0].id;
                            this.currentVenderCompanyId =  res.data[0].id;
                            // console.log('@@@@', this.currentVenderCompanyId);
                            this.companyService.getCompany(this.currentLoginCompanyId).subscribe(
                                res=>{
                                    const company_name = res.name;
                                    this.searchService.searchAccountCompany(company_id, company_name, '', '').subscribe(
                                        res=>{
                                            if(res.data[0]){
                                                const customer_id = res.data[0].id;
                                                this.vrmService.getproductInterested(company_id, customer_id).subscribe(
                                                    res=>{
                                                        this.productInterested = res;
                                                        // console.log(this.productInterested);
                                                    }
                                                )
                                            }
                                        }
                                    )
                                }
                            )
                        }
                    }
                )

            }
        )
    }

    addOrderDialog() {
        const dialogRef = this.dialog.open(PSDialogComponent, {
            width:'700px',
            data:{
                company_id: this.currentLoginCompanyId,
                customer_id: this.vendorId,
                vendor_company_id : this.currentVenderCompanyId
              }
        });
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
            customer_id: this.vendorId
          }
        });
    }

    setGoogleMap(){
        this.markers = [];
        let lati, long, center;
        let defaultCenter = new google.maps.LatLng(40.7128, 74.0060);

        if(!this.vendorAddresses || this.vendorAddresses.length === 0){
            center = defaultCenter;
          } else {
            lati = this.vendorAddresses[0].latitude;
            long = this.vendorAddresses[0].longitude;
            center = new google.maps.LatLng(lati, long);
          }

        var mapProp = {
            center: center,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
  
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        var bounds = new google.maps.LatLngBounds();

        if(this.vendorAddresses && this.vendorAddresses.length){
            for (var i = 0; i < this.vendorAddresses.length; i++){
                if(this.vendorAddresses[i] && this.vendorAddresses[i].latitude && this.vendorAddresses[i].longitude){
                    let tempPoint = new google.maps.LatLng(
                        this.vendorAddresses[i].latitude,
                        this.vendorAddresses[i].longitude
                    )
                    let tempMarker = new google.maps.Marker({
                        position: tempPoint,
                        animation: google.maps.Animation.DROP,
                    });

            //set each info window
            let infowindow = new google.maps.InfoWindow({
                content: `
                <div style="width:250px !important;">
                    ${this.vendorAddresses[i].street1},
                    ${this.vendorAddresses[i].city},
                    ${this.vendorAddresses[i].state},
                    ${this.vendorAddresses[i].zipcode}
                </div>
                `
            });
            this.infoWindows.push(infowindow);
            tempMarker.setMap(this.map);
            bounds.extend(tempMarker.getPosition());
            //   this.markers.push(tempMarker);
            //   this.infoWindows[i].open(this.map, this.markers[i]);
                }
            }
        }
        this.map.fitBounds(bounds);
    }

    /*-------------------------------convert  begin-------------------------------*/
    convertProspect(){
        // alert('coming soon ...');
        this.dialogService.openSureDialog().subscribe(result =>{
            if(result){
                this.isLoading = true;
                this.vrmService.convertProspect(this.currentLoginCompanyId, this.vendorId).subscribe(()=>{
                    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/vrm/backup-vendor`).then(()=>{
                        this.toasterService.showToaster('Convert success','',3000);
                        this.isLoading = false;
                    })
                }
                )
            }
        })
    }

    convertBackup(){
        // alert('coming soon ...');
        // console.log("vendor");
        this.dialogService.openSureDialog().subscribe(result =>{
            if(result){
                this.isLoading = true;
                this.vrmService.convertBackup(this.currentLoginCompanyId, this.vendorId).subscribe(()=>{
                    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/vrm/main-vendor`).then(()=>{
                        this.toasterService.showToaster('Convert success','',3000);
                        this.isLoading = false;
                    })
                }
                )
            }
        })
    }

    /*-----------------------convert  begin--------------------------------------*/



/* ---------------------attachment begin---------------------------*/
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

      onClickAttachment(attachment, index){
        this.selectedAttachmentIndex = index;
          // console.log(attachment);
        this.modalOpen = true;
        if(attachment.description.includes('image')){
          this.show = 'image';
        } else {
           this.show = 'other';
          this.attachmentUrl = attachment.url;
          window.open(this.attachmentUrl, '_blank');
        }
      }

/* ------------------attachment end-------------------------*/

caculate(){
    alert("coming soon......")
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
    console.log(fd);
    this.commonService.addAttachment(this.currentLoginCompanyId,this.vendorId, fd).subscribe(
        (res) => {
            this.isLoading = false;
            console.log(res);
            this.vrmService.getVendor(this.currentLoginCompanyId,this.vendorId).subscribe(
                res1=> {
                    this.Vendor = res1;
                })
        },
        err => {
          console.log("upload attachment error");
        }
    )
}

addAttachementDialogForProduct(){
    console.log('123');
    this.attachmentProductModalOpen =true;
}




}

@Component({
    selector:'ps-dialog',
    templateUrl:'ps-dialog.component.html',
})

export class PSDialogComponent {

 
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public dialogRef: MatDialogRef<PSDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            
         }

    onNoClick(): void {
        this.dialogRef.close();
    }

    // checkOrderHistory() {
    //     this.router.navigateByUrl(`/company/${this.data.company_id}/crm/account/${this.data.customer_id}/purchase-orders/orders`).then(() => {
    //         this.dialogRef.close();
    //     });
    // }

    // addNewOrder() {
    //     this.router.navigateByUrl(`/company/${this.data.company_id}/crm/account/${this.data.customer_id}/share-order`).then(() => {
    //         this.dialogRef.close();
    //     });
    // }

    checkSharedOrder() {
        console.log(this.data);
        // this.router.navigateByUrl(`/company/${this.data.company_id}/vrm/main-vendor/${this.data.customer_id}/purchase-orders/${this.data.vendor_company_id}/orders/vrm`).then(() => {
        //     this.dialogRef.close();
        // });
        this.router.navigateByUrl(`/company/${this.data.company_id}/vrm/main-vendor/${this.data.customer_id}/purchase-orders/${this.data.vendor_company_id}/orders/vrm`).then(() => {
            this.dialogRef.close();
        });
    }



    
}