import { Component, ViewChild, ElementRef, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { OrdersService } from 'app/core/services/orders.service';
import { ShippingInfoService } from 'app/core/services/shippingInfo.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddShippedComponent } from './add-shipped/add-shipped.component';
import { AddAttachmentComponent } from './attachements/add-attachments/add-attachements.component';
import { AddProdDateComponent } from './prod-date/add-prod-date/add-prod-date.component';
import { ConfirmProdDateComponent } from './prod-date/confirm-prod-date/confirm-prod-date.component';
import { Production_Schedule } from 'app/core/models/index';
import { CompanyService } from 'app/core/services/company.service';
import 'jspdf-autotable';
import { DialogService } from 'app/core/services/dialog.service';
declare let jsPDF: any;
declare var require: any;

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})

export class OrderStatusComponent implements OnInit, OnDestroy {
  vendorName = "";
  vendorId;
  ownCompany;
  isLoading: boolean = false;
  selectedAttachment;
  refreshHeight = 300;
  next;
  orderCustomerId;
  showEditButton: boolean = false;
  order_id : number;
  item: any;
  companyId: number;
  itemId: number;
  shippingInfos;
  currentBalance: number = 0;
  schedules: Production_Schedule[] = [];
  // hideAddSheduleBtn : boolean = true;
  modalOpen = false;
  selectedAttachmentIndex: number;
  attachmentUrl = '';
  company_defined_columns = [];

  showFolder: boolean = true;
  attachmentMap = new Map();
  selectAttachmentArr = [];
  selectFolderName: string = '';
  nonCategoryAttachArr = [];
  category = '';
  selectedImg = '';
  clearanceShippingInfos;
  groundShippingInfos;
  finishShippingInfos;
  totalReceivedQty: number = 0;
  selectProductPic: boolean = false;
  private sub: any;
  selectedFolderStatus;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private shippingInfoService: ShippingInfoService,
    private dialog: MatDialog,
    private companyService: CompanyService,
    private dialogService: DialogService
  ) {
    this.companyId = + this.route.snapshot.paramMap.get('cid');
    this.itemId = + this.route.snapshot.paramMap.get('iId');
    this.order_id = + this.route.snapshot.paramMap.get('oId');
    this.sub = this.route.parent.params.subscribe(params => {
      this.vendorId = +params["vendor_company_id"];
      if (this.vendorId) {
        this.companyId = this.vendorId;
        this.getOrderItem(this.vendorId);
        this.getAllShippings(this.vendorId);
        this.ownCompany = false;
        this.checkEditAuth();

      } else {
        this.getOrderItem(this.companyId);
        this.getAllShippings(this.companyId);
        this.ownCompany = true;
        this.checkEditAuth();

      }
    });

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkEditAuth() {
    this.ordersService.checkEditOrderStatusAuth(this.companyId, this.order_id).subscribe(
      res => {
        this.showEditButton = res.auth;
      }
    )
  }

  onShowProdPic() {
    this.selectProductPic = true;
    this.modalOpen = true;
  }

  getOrderItem(companyId) {
    this.isLoading = true;
    this.ordersService.getOrderItem(companyId, this.itemId).subscribe(
      (res) => {
        this.isLoading = false;
        this.item = res;
        this.ordersService.setPdId(this.item.product.id);
        this.currentBalance = this.item.balance;
        console.log(this.item);
        this.attachmentMap = new Map();
        this.sortAttachment();
        let columnsObj = this.item.company_defined_columns;
        if (columnsObj && (Object.keys(columnsObj).length > this.company_defined_columns.length)) {
          for (var prop in columnsObj) {
            if ((prop != 'color') && (prop != 'material')) {
              this.company_defined_columns.push({
                name: prop,
                value: columnsObj[prop]
              });
            }
          }
        }
        if (!this.item.est_production_date) {
          this.schedules = [];
        } else {
          // this.schedules = JSON.parse(this.item.est_production_date);
          // console.log('schedules : ', this.schedules);
        }
      },
      (err) => {
      }
    )
  }

  getAllShippings(companyId) {
    this.isLoading = true;
    for (var type = 1; type <= 4; type++) {
      this.getShippingByType(companyId, type);
    }

  }

  getShippingByType(companyId, shipping_type) {
    this.isLoading = true;
    this.shippingInfoService.getShippingInfoCollection(companyId, this.itemId, shipping_type).subscribe(
      (res) => {
        this.isLoading = false;
        if (shipping_type == 1) {
          this.shippingInfos = res;
          console.log(this.shippingInfos.data);
          // this.shippingInfos.data.sort(this.sortShippingInfoArr);
          this.shippingInfos.paging = res.paging;
          this.next = this.shippingInfos.paging.next;
        } else if (shipping_type == 2) {
          this.clearanceShippingInfos = res;
          console.log(this.clearanceShippingInfos.data);
          // this.clearanceShippingInfos.data.sort(this.sortShippingInfoArr);
        } else if (shipping_type == 3) {
          this.groundShippingInfos = res;
          // this.groundShippingInfos.data.sort(this.sortShippingInfoArr);
        } else if (shipping_type == 4) {
          this.finishShippingInfos = res;
          // this.finishShippingInfos.data.sort(this.sortShippingInfoArr);
        }
      },
      (err) => {
      }
    );
  }

  getNextShipping(next, shipping_type) {
    if (!this.isLoading) {
      this.isLoading = true;
      this.shippingInfoService.getNextShippingCollection(next).subscribe(
        (res) => {
          this.isLoading = false;
          if (shipping_type == 1) {
            this.shippingInfos.data = this.shippingInfos.data.concat(res.data);
            // this.shippingInfos.data.sort(this.sortShippingInfoArr);
            this.next = res.paging.next;
          } else if (shipping_type == 2) {
            this.clearanceShippingInfos.data = this.clearanceShippingInfos.data.concat(res.data);
            // this.clearanceShippingInfos.data.sort(this.sortShippingInfoArr);
            this.clearanceShippingInfos.paging = res.paging;
          } else if (shipping_type == 3) {
            this.groundShippingInfos.data = this.groundShippingInfos.data.concat(res.data);
            // this.groundShippingInfos.data.sort(this.sortShippingInfoArr);
            this.groundShippingInfos.paging = res.paging;

          } else if (shipping_type == 4) {
            this.finishShippingInfos.data = this.finishShippingInfos.data.concat(res.data);
            // this.finishShippingInfos.data.sort(this.sortShippingInfoArr);
            this.finishShippingInfos.paging = res.paging;
          }
        }
      )
    }

  }

  onSelectedShippingInfo(info, index) {
    console.log(info);
    this.shippingInfoService.setSelectedShippingInfo(info, index, this.item, this.item.shipping_method);
  }
  
  readShipping(info) {
    let obj = {
      order_item_shipping_id : info.id,
    }
    this.ordersService.markUnread(this.companyId, obj).subscribe(
        res => {
          info.is_unread = false;
        }
    );
  }
  evaluateLate(data) {
    let res = false;
    // This doesnt work on phone, but works on computer
    // let actualDate = new Date(data.actual_arrive_date).getTime();
    // let estimateDate = new Date(data.eta_date).getTime();
    let actualDate = data.actual_arrive_date;
    let estimateDate = data.eta_date;

    if (actualDate && estimateDate) {
      if (actualDate > estimateDate) {
        res = true;
      }
    }
    return res;
  }

  onMouseWheel(evt) {
    if (evt.target.scrollTop > this.refreshHeight) {
      if (this.next) {
        this.refreshHeight += 300;
        this.getNextShipping(this.next, 1);
      }
    }
  }

  onReceiveWheel(event) {
    let next = event.next;
    let type = event.type;
    this.getNextShipping(next, type);
  }

  sortShippingInfoArr(a, b) {
    let res = -1;
    let aDate = new Date(a.created.at).getTime();
    let bDate = new Date(b.created.at).getTime();
    if (aDate >= bDate) {
      res = 1;
    }
    return res;
  }

  checkScheduleIsFinished() {
    if (!this.schedules || this.schedules.length == 0) {
      return false;
    }
    if (this.schedules[this.schedules.length - 1].ifFinish) {
      return true;
    }
    return false;
  }

  confirmProdDateDialog(i, j) {
    const dialogRef = this.dialog.open(ConfirmProdDateComponent, {
      width: '700px',
      data: {
        company_id: this.companyId,
        order_item_id: this.itemId,
        quantity: this.item.quantity,
        index: i,
        innerIndex: j,
        schedules: this.schedules,
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        setTimeout(() => {
          this.getAllShippings(this.companyId);
        }, 0.5)
      });
  }

  addEstProdDateDialog() {
    const dialogRef = this.dialog.open(AddProdDateComponent, {
      width: '700px',
      data: {
        company_id: this.companyId,
        order_item_id: this.itemId,
        quantity: this.item.quantity,
        schedules: this.schedules
      }
    });


    dialogRef.afterClosed().subscribe(
      result => {
        setTimeout(() => {
          this.getAllShippings(this.companyId);
        }, 0.3)
      });
  }

  onGetFetchOrderItem() {
    this.getOrderItem(this.companyId);
  }

  addShippingInfoDialog() {
    const dialogRef = this.dialog.open(AddShippedComponent, {
      width: '700px',
      data: {
        company_id: this.companyId,
        order_item_id: this.itemId
      }
    });


    dialogRef.afterClosed().subscribe(
      result => {
        this.getAllShippings(this.companyId);
      });
  }

  addAttachementDialog() {
    // let compnay_Id : number;
    // if(this.vendorId){
    //   compnay_Id = this.vendorId;
    // } else {
    //   compnay_Id = this.companyId;
    // }
    const dialogRef = this.dialog.open(AddAttachmentComponent, {
      width: '700px',
      data: {
        company_id: this.companyId,
        order_item_id: this.itemId,
        selectFolderName: this.selectFolderName,
        selectFolderStatus: this.selectedFolderStatus,
        edit_mode: this.item.public
      }
    });


    dialogRef.afterClosed().subscribe(
      result => {
        this.getOrderItem(this.companyId);
      });
  }

  showNote(index) {
    let res = false;
  }

  onSelecedNote(note, index) {
    this.ordersService.setNote(note);
    this.router.navigate([`./orderItemNote/${index}`], { relativeTo: this.route });
  }

  sortAttachment() {
    if (this.item && this.item.attachments && this.item.attachments.length > 0) {
      let attachments = this.item.attachments;
      attachments.forEach((attach) => {
        let cate = attach.category;
        if (!this.attachmentMap.has(cate)) {
          this.attachmentMap.set(cate, [attach]);
        } else {
          let arr = this.attachmentMap.get(cate);
          arr.push(attach);
          this.attachmentMap.set(cate, arr);
        }
      })
      this.item.attachments = Array.from(this.attachmentMap);
      this.nonCategoryAttachArr = this.attachmentMap.get(null);
    }
    if (this.category) {
      this.showFiles(this.category);
    }

  }

  getFirstImg(desciption) {
    let des = JSON.parse(desciption);

    for (var i = 0; i < des.length; i++) {
      if (des[i].img) {
        return des[i].img;
      }
    }
    return false;
  }


  getIconImg(attachment) {
    if (attachment.description) {
      let type = attachment.description;
      if (type.includes('jpg') || type.includes('jpeg') || type.includes('png' || type.includes('image/'))) {
        return attachment.url;
      } else if (type.includes('pdf')) {
        return 'assets/images/icons/pdf.png';
      } else if (type.includes('word')) {
        return 'assets/images/icons/word.png';
      } else if (type.includes('xml')) {
        return 'assets/images/icons/excel.png';
      }
    }
    return 'assets/images/icons/unknow.png';
  }

  onClickAttachment(attachment, index) {

    this.selectedAttachment = attachment;
    this.selectedAttachmentIndex = index;
    let type = attachment.description;
    if ((!type) || type.includes('image')) {
      this.openModal(attachment.url);
    } else if (type.includes('pdf')) {
      this.openModal('assets/images/icons/pdf.png');
    } else if (type.includes('word')) {
      this.openModal('assets/images/icons/word.png');
    } else if (type.includes('xml')) {
      this.openModal('assets/images/icons/excel.png');
    } else {
      this.attachmentUrl = attachment.url;
      window.open(this.attachmentUrl, '_blank');

    }
  }

  onDownload(selectedAttachment) {
    window.open(selectedAttachment.url, '_blank');
  }

  openModal(url) {
    this.selectedImg = url;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectProductPic = false;
    this.selectedAttachment = '';
  }

  showFiles(category) {
    if (category) {
      this.showFolder = false;
    }
    this.category = category;
    this.selectAttachmentArr = [];
    this.selectAttachmentArr = this.attachmentMap.get(category);
    this.selectFolderName = category;
    this.selectedFolderStatus = this.selectAttachmentArr[0].attachment_status;
  }

  backToFolder() {
    this.showFolder = true;
    this.selectAttachmentArr = [];
    this.selectFolderName = '';
    this.category = '';
    this.selectedFolderStatus = '';
  }

  checkAuth() {
    return true;
  }
  getUnread(attachment){
    let count = 0;
    attachment[1].forEach(element => {
      if(element.unread) {
        count++;
      }
    });
    return count;
  }
  getInfo(info) {
    return info;
  }
}
