import 'rxjs/add/operator/switchMap';
import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { DialogService } from 'app/core/services/dialog.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { Potential, PotentialService } from 'app/core/services/potential.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddAttachmentComponent } from 'app/components/add-attachement/add-attachment.component';
import { AddProductComponent } from 'app/components/add-product/add-product.component';
import { CommonService } from 'app/core/services/common.service';
import { AddCrmOpportunityComponent } from 'app/components/add-crm-opportunity/add-crm-opportunity.component';

@Component({
    selector: 'potential-details',
    templateUrl:'potential-details.component.html',
    styleUrls:['potential-details.component.scss']
})

export class PotentialDetailsComponent{

    Potential$: Observable<Potential>;
    currentLoginCompanyId;
    potentialId;
    potentialName;
    isLoading;
    companyContacts;
    companyAddresses;
    isShowMap:boolean = false;


    //attachment
    selectedAttachmentIndex: number;
    attachmentUrl = '' ;
    show;
    modalOpen = false;
    
    // * Edited by Lisa, 5/31/2018
    isPurchaseGoods = false;
    isProductInterested = true;
    isProductAttachment = false;
    productModalOpen = false;
    attachmentProductModalOpen = false;
    attachmentProductUrl;
    attachmentProductContent;
    attachemntProductCreateAt;   
    prodcutSelectedType:string = 'Interested';
    fakeProductUrl = 'assets/images/bottle.png';
    fakeProductLists=[]
    // * ends
    

    @ViewChild('crmgmap') gmapElement: any;
    map: google.maps.Map;
    infoWindows = [];
    markers : any[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,

        private service: PotentialService,
        private dialogService: DialogService,
        private toasterService: ToasterService,
        private dialog: MatDialog,
        private commonService: CommonService
    ){
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.potentialId = this.route.snapshot.paramMap.get('cusid');
        this.isLoading = true;
    }
    

    ngOnInit(){
        this.service.getPotential(this.currentLoginCompanyId, this.potentialId ).subscribe(
            res1=>{
                this.Potential$ = res1;
                this.potentialName = res1.name;
                console.log(this.potentialName);
                this.service.getPotentialContacts(this.currentLoginCompanyId,this.potentialId).subscribe(
                    res2=>{
                       this.companyContacts = res2.data;
                    })
                this.service.getPotentialAddresses(this.currentLoginCompanyId,this.potentialId).subscribe(
                    res3=>{
                        this.companyAddresses = res3.data;
                    })
                this.isLoading = false;
            }
        )
    }


    convertPotential(){
        this.dialogService.openSureDialog().subscribe(result =>{
            if(result){
                this.isLoading = true;
                this.service.convertPotetnial(this.currentLoginCompanyId, this.potentialId).subscribe(()=>{
                    this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/crm/account`).then(()=>{
                        this.toasterService.showToaster('Convert success','',3000);
                        this.isLoading = false;
                    })
                }
                    
                )
            }
        })
        
    }

    addAttachementDialog(){
        const dialogRef = this.dialog.open(AddAttachmentComponent, {
          width:'700px',
          data:{
            company_id: this.currentLoginCompanyId,
            customer_id: this.potentialId
          }
        });

        dialogRef.afterClosed().subscribe(
            result=>{
                this.isLoading = true;
                this.service.getPotential(this.currentLoginCompanyId, this.potentialId).subscribe(
                    res=>{
                        this.Potential$ = res;
                        this.isLoading = false;
                    }
                )
            }
        )
    }


    // * Edited by Lisa, 5/31/2018
    addAttachementDialogForProduct(){
        const dialogRef = this.dialog.open(AddAttachmentComponent, {
          width:'700px',
          data:{
            company_id: this.currentLoginCompanyId,
            customer_id: this.potentialId,
            product: 1
          }
        });

        dialogRef.afterClosed().subscribe(
            result=>{
                if(result){
                    this.isLoading = true;
                    this.service.getPotential(this.currentLoginCompanyId,this.potentialId).subscribe(
                    res5=>{
                        this.Potential$ = res5;
                        this.isLoading = false;
                    })
                }
               
            }
        )
    }

    addOpportunityDialog(){
        console.log('opportunity component');
        const dialogRef = this.dialog.open(AddCrmOpportunityComponent, {
            width: '700px',
            data:{
                company_id: this.currentLoginCompanyId,
                customer_id : this.potentialId,
                customer_data : this.Potential$
            }
        })

        console.log(this.currentLoginCompanyId, this.potentialId, this.potentialName);

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
            customer_id: this.potentialId,
          }
        });

        dialogRef.afterClosed().subscribe(
            result=>{
                this.isLoading = true;
                this.service.getPotential(this.currentLoginCompanyId,this.potentialId).subscribe(
                res6=>{
                    this.Potential$ = res6;
                    this.isLoading = false;
                })
            }
        )
    }
    // * ends
    
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

    setGoogleMap(){
        this.markers = [];
        let lati, long, center;
        let defaultCenter = new google.maps.LatLng(40.7128, 74.0060);

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
            bounds.extend(tempMarker.getPosition());
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
    
      // * for product attachment, edited by Lisa, 5/31/2018
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
      // * ends
    //for document 
      onReceivedFormData(fd){
        // console.log(fd);
        this.commonService.addAttachment(this.currentLoginCompanyId,this.potentialId, fd).subscribe(
            (res) => {
                this.isLoading = false;
                // console.log(res);
                this.service.getPotential(this.currentLoginCompanyId,this.potentialId).subscribe(
                    res1=> {
                        this.Potential$ = res1;
                    })
            },
            err => {
              console.log("upload attachment error");
            }
        )
      }

      getFullName(first_name, last_name){
        return first_name + " " + last_name
    }
}