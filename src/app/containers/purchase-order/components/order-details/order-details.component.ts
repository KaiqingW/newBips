import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OrdersService } from 'app/core/services/orders.service';
import { Order } from 'app/core/models/index';
import { DatePipe } from '@angular/common';
import { CompanyService } from 'app/core/services/company.service';
import { DialogService } from 'app/core/services/dialog.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit, OnChanges {

  vendorId: number;
  accountId: number;
  sharedUserList;
  orderCustomerId: number;
  @Input() openOrder;
  @Output() openOrderProcess: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private datePipe: DatePipe,
    private companyService: CompanyService,
    private dialogService: DialogService
  ) {
    this.companyId = + this.route.snapshot.paramMap.get('cid');
    this.orderId = + this.route.snapshot.paramMap.get('oId');
    this.vendorId = +this.route.snapshot.paramMap.get('vendor_company_id');
    this.accountId = +this.route.snapshot.paramMap.get('cusid');
  }

  items;
  order;
  isLoading: boolean = false;
  companyId: number;
  orderId: number;
  status = ['Pending', 'Prepaing', 'Production', 'Oversea', 'Clearance', 'Ground', 'Arrived', 'Finished'];
  orderClosed : boolean = false;

  ngOnInit() {
    if (this.vendorId) {
      this.searchVenderCompany();
    } else if (this.companyId) {
      this.getOrder(this.companyId);
      this.getOrderItems(this.companyId);
      this.getOrderSharedUser(this.companyId);
    }
  }

  ngOnChanges() {
    if (!this.orderId && this.openOrder) {
      this.orderId = +this.openOrder.id;  
    }
  }

  searchVenderCompany() {
    // this.companyService.searchCompany(this.vendorName).subscribe(
    //   res => {
    //     this.vendorId = res.data[0].id;
    this.getOrder(this.vendorId);
    this.getOrderItems(this.vendorId);
    this.getOrderSharedUser(this.vendorId);
    // }
    // );
  }

  getOrderSharedUser(companyId) {
    if (this.openOrder) {
      this.openOrderProcess.emit(true);
    } else {
      this.isLoading = true;
    }
    this.ordersService.getOrderSharedUser(companyId, this.orderId).subscribe(
      (res) => {
        this.isLoading = false;
        this.openOrderProcess.emit(false);
        this.sharedUserList = res;
      }
    )
  }

  onGetNavToAttachementOrNote({type, item}) {
    if(type == 'notes'){
      this.router.navigate([`/company/${this.companyId}//purchase-order/orders/${this.orderId}/item/${item.id}/notes/notesSubject`]);
    } else if (type == 'attachment'){
      this.router.navigate([`/company/${this.companyId}//purchase-order/orders/${this.orderId}/item/${item.id}/attachments`]);
    }
  }

  navToItem(item) {
    // if (this.vendorId) return;
    let item_id = item.id;
    if (this.route.snapshot.paramMap.get('oId')) {
      this.router.navigate(['item', item_id], { relativeTo: this.route });
    } else {
      this.router.navigate([this.orderId, 'item', item_id], { relativeTo: this.route });
    }
  }

  getOrder(companyId) {

    this.isLoading = true;
    this.ordersService.getOrderDetail(companyId, this.orderId).subscribe(
      (res) => {
        this.isLoading = false;
        this.order = res;
        if (this.order.customer) {
          this.accountId = this.order.customer.id;
        }
      },
      (err) => {
      }
    )
  }

  getOrderItems(companyId) {
    this.isLoading = true;
    this.ordersService.getOrderItems(companyId, this.orderId).subscribe(
      (res) => {
        this.isLoading = false;
        this.items = res.data;
      },
      (err) => {
      }
    )
  }

  addSharedUser() {
    this.router.navigate([`/company/${this.companyId}/crm/account/${this.accountId}/purchase-orders/orders/${this.orderId}/share-order`]);
  }

  closeOrder() {
    
    this.dialogService.openSureDialog().subscribe(
      res => {
        if(res){
            this.isLoading = true;
            let info = {
              status: 7
            }
            this.ordersService.updateOrder(this.companyId, this.orderId, info).subscribe(
              (res) => {
                // this.isLoading = false;
              },
              (err) => {

              }, 
              () => {
                this.isLoading = false;
                this.orderClosed = true;
              }
            )
        }
      }
    )
      
  }
}
