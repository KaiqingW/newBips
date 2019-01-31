import { Component, OnInit, OnChanges,Input, Output, EventEmitter} from '@angular/core';
import { Production_Schedule } from 'app/core/models/index';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddShippedComponent } from '../add-shipped/add-shipped.component';
import { ShippingInfoService} from 'app/core/services/shippingInfo.service';
import { OrdersService } from 'app/core/services/orders.service';

@Component({
    selector: 'shipping',
    templateUrl: './shipping.component.html',
    styleUrls: ['./shipping.component.scss']
})


export class ShippingComponent implements OnInit, OnChanges{
    @Input() title : string;
    @Input() title2 : string;
    @Input() shippingInfos;
    @Input() ownCompany;
    @Input() companyId;
    @Input() itemId;
    @Input() item;
    @Input() shippingType;
    @Output() sendWheel = new EventEmitter<any>();
    @Input() orderCustomerId = -1;
    refreshHeight= 200;
    next;
   
    constructor(
        private dialog: MatDialog,
        private shippingInfoService : ShippingInfoService,
        private orderService: OrdersService,
    ){}
    
    ngOnInit(){
    }

    ngOnChanges(){
        if(this.shippingInfos && this.shippingInfos.paging &&  this.shippingInfos.paging.next){
            this.next = this.shippingInfos.paging.next;
        }
    }

    addShippingInfoDialog(){
        const dialogRef = this.dialog.open(AddShippedComponent, {
            width:'700px',
            data:{
              company_id: this.companyId,
              order_item_id: this.itemId      }
          });
      
      
          dialogRef.afterClosed().subscribe(
            result => {
            // this.getShippingInfo(this.companyId);
          });
    }

    onSelectedShippingInfo(info, index){
        console.log(info);
        this.shippingInfoService.setSelectedShippingInfo(info, index, this.item, 'none');
        this.readShipping(info);
    }

    readShipping(info) {
        let obj = {
            order_item_shippping_id: info.id,
        }
        this.orderService.markUnread(this.companyId, obj).subscribe(
            res => {
                console.log(res);
            }
        );
    }

    evaluateLate(data){
        let res = false;
        // This doesnt work on phone, but works on computer
        // let actualDate = new Date(data.actual_arrive_date).getTime();
        // let estimateDate = new Date(data.eta_date).getTime();
        let actualDate = data.actual_arrive_date;
        let estimateDate = data.eta_date;
    
        if(actualDate && estimateDate){
          if(actualDate > estimateDate){
            res = true;
          }
        }
        return res;
    }

    onMouseWheel(evt){
        if(evt.target.scrollTop >  this.refreshHeight ){
          if(this.next){
             this.refreshHeight += 200;
            //  this.isLoading = true;
             this.sendWheel.emit({
                next: this.next,
               type: this.shippingType
             });
             this.next = '';
           }
        }
    }
    getInfo(info) {
        console.log(info);
    }

}