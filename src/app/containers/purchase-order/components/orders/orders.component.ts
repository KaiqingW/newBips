import { Component, OnInit, ViewChild, Pipe, OnChanges, OnDestroy, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { ToasterService } from 'app/core/services/toaster.service';
import { DialogService } from 'app/core/services/dialog.service';
import { CompanyService } from 'app/core/services/company.service';
import * as moment from 'moment';
import { Params } from "@angular/router";
// import "./src/orcasmart-theme.scss";
import { environment } from 'environments/environment';

import { OrdersService } from 'app/core/services/orders.service';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { SearchService } from '../../../../core/services/search.service';
import { InventoryService } from '../../../../core/services/inventory.service';
import { Subscription } from 'rxjs/Subscription';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})

export class OrdersComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  currentDate = new Date();
  startDate = '';
  endDate = '';
  orders: any = [];
  nextOrders: any = [];
  selectedOrder: any = this.orders[0];
  id;
  accountId = "";
  vendorName = "";
  vendorId;
  currentDay = this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDate();
  //choices = ['PO#', 'Status', 'Container #', 'Date'];
  choices = ['PO#', 'Container#', 'Date', 'Pending', 'Prepaing', 'Production', 'On The Ocean', 'Clearance', 'Ground', 'Arrived', 'Finished', 'Item#', 'Product Name'];
  order_status = ['Pending', 'Processing', 'Completed'];
  status = ['Pending', 'Est Production', 'Production', 'Oversea', 'Clearance', 'Ground', 'Arrived', 'Finished'];

  //This is the url to get next page of orders;
  // example: "http://api.orcasmart.us/company/1/order?page=2"
  next: '';

  //set maximum refresh height;
  refreshHeight = 150;

  // count mouse wheel
  countMouseWheel = 0;
  orderItems = [];
  isLoading: boolean = false;
  showAddBtn: boolean = false;
  showFilterModal: boolean = false;
  showPresetsModal: boolean = true;
  search_obj = {};
  filterValue = '';
  placeholder = 'Search By PO#';
  searchCtrl: FormControl = new FormControl();
  choiceCtrl: FormControl = new FormControl();
  choiceValue;
  containers;
  selectedContainer;
  selecedContainerItems;
  openOrder = '';
  container_mode: boolean = false;
  containerToOrder = false;
  container_subscription: Subscription;
  container_number;
  precise_search: boolean = false;
  customer_id: number;
  //edit simon
  //define for paginate
  currentPage = 1;
  lastPageUrl;
  nextPageUrl;
  //jump by page number
  lastPageNumber;
  local_storage_info;
  is_inital: boolean = true;
  company_id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toasterService: ToasterService,
    private dialogService: DialogService,
    private orderService: OrdersService,
    private companyService: CompanyService,
    private searchService: SearchService,
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {
    this.isLoading = true;
    this.id = + this.route.snapshot.paramMap.get('cid');
    this.currentPage = +this.route.snapshot.paramMap.get('page');
    this.vendorName = this.route.snapshot.paramMap.get('vendorName');
    this.customer_id = +this.route.snapshot.paramMap.get('cusid');
    if (this.route.snapshot.paramMap.get('cusid')) {
      this.accountId = this.route.snapshot.paramMap.get('cusid');
    }
    if (!this.vendorName && !this.accountId) {
      this.showAddBtn = true;
    }
    this.subscribeContainerChoosed();
    if (!this.company_id) {
      this.company_id = +this.route.snapshot.paramMap.get('cid');
  }
  }

  scrollToPreviousPos() {
    let content = document.getElementById('content');
    content.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  // step forth, import AfterViewChecked, and implements AfterViewChecked
  // at ngAfterViewChecked() function, call backToLocation() function 
  // so that when you go back to the page, it will jump to the location that you scrolled previous automatically, editted by yali
  ngAfterViewChecked() {
    this.backToLocation();
  }

  ngOnInit() {
    if (this.vendorName) {
      this.searchVender();
    }
    this.getLocalStorage();
    this.switchChoiceCtrl();
    this.subscribeChoieChange();
    this.subscribeValueChange();
  }

  switchChoiceCtrl() {
    if (localStorage.getItem('order')) {
      let local_storage = JSON.parse(localStorage.getItem('order'))['type'];
      switch (local_storage) {
        case 'Container#':
          this.choiceValue = this.choices[1];
          break;
        case 'Date':
          this.choiceValue = this.choices[2];
          break;
        case 'Pending':
          this.choiceValue = this.choices[3];
          break;
        case 'Prepaing':
          this.choiceValue = this.choices[4];
          break;
        case 'Production':
          this.choiceValue = this.choices[5];
          break;
        case 'On The Ocean':
          this.choiceValue = this.choices[6];
          break;

        case 'Clearance':
          this.choiceValue = this.choices[7];
          break;
        case 'Ground':
          this.choiceValue = this.choices[8];
          break;
        case 'Arrived':
          this.choiceValue = this.choices[9];
          break;
        case 'Finished':
          this.choiceValue = this.choices[10];
          break;
        case 'Item#':
          this.choiceValue = this.choices[11];
          break;
        case 'Product Name':
          this.choiceValue = this.choices[12];
          break;
        default:
          this.choiceValue = this.choices[0];
          break;
      }
    } else {
      this.choiceValue = this.choices[0];
    }

  }

  getLocalStorage() {
    if (!localStorage.getItem('order')) {
      return;
    }
    this.local_storage_info = JSON.parse(localStorage.getItem('order'));
    if (this.is_inital) {
      this.lastPageUrl = this.local_storage_info['previous'];
      this.nextPageUrl = this.local_storage_info['next'];
      this.currentPage = this.local_storage_info['current_page'];
      this.search_obj = this.local_storage_info['search_obj'];
      this.lastPageNumber = this.local_storage_info['last_page'];

      if (this.local_storage_info.type == 'PO#' && this.local_storage_info['search_obj'] && this.local_storage_info['search_obj']['purchase_order_number']) {
        this.choiceCtrl.patchValue(this.choices[0]);
        this.searchCtrl.patchValue(this.local_storage_info['search_obj']['purchase_order_number']);
      } else if (this.local_storage_info.type == 'Container#' && this.local_storage_info['search_obj'] && this.local_storage_info['search_obj']['container_number']) {
        this.choiceCtrl.patchValue(this.choices[1]);
        this.searchCtrl.patchValue(decodeURIComponent(this.local_storage_info['search_obj']['container_number']));
      } else if (this.local_storage_info.type == 'Date' && this.local_storage_info['search_obj'] && this.local_storage_info['search_obj']) {
        this.choiceCtrl.patchValue(this.choices[2]);
        if (this.local_storage_info['search_obj']['start_date']) {
          this.search_obj['start_date'] = this.local_storage_info['search_obj']['start_date'];
        }
        if (this.local_storage_info['search_obj']['end_date']) {
          this.search_obj['end_date'] = this.local_storage_info['search_obj']['end_date'];
        }
        if (this.local_storage_info['search_obj']['search_value']) {
          this.placeholder = this.local_storage_info['search_obj']['search_value'];
        }
      } else if (this.local_storage_info.type == 'Item#' && this.local_storage_info['search_obj'] && this.local_storage_info['search_obj']) {
        this.choiceCtrl.patchValue(this.choices[12]);
      } else if (this.local_storage_info.type == 'Product Name' && this.local_storage_info['search_obj'] && this.local_storage_info['search_obj']) {
        this.choiceCtrl.patchValue(this.choices[13]);
      }
    }
  }

  getLocalStorageSearchValue() {
    if (!localStorage.getItem('order')) {
      return;
    }
    this.local_storage_info = JSON.parse(localStorage.getItem('order'));
    if (this.is_inital) {
      if (this.local_storage_info.type == 'PO#' && this.local_storage_info['search_obj'] && this.local_storage_info['search_obj']['purchase_order_number']) {
        this.searchCtrl.patchValue(this.local_storage_info['search_obj']['purchase_order_number']);
      } else if (this.local_storage_info.type == 'Container#' && this.local_storage_info['search_obj'] && this.local_storage_info['search_obj']['container_number']) {
        this.searchCtrl.patchValue(decodeURIComponent(this.local_storage_info['search_obj']['container_number']));
      } else if (this.local_storage_info.type == 'Date' && this.local_storage_info['search_obj'] && this.local_storage_info['search_obj']) {
        if (this.local_storage_info['search_obj']['start_date']) {
          this.search_obj['start_date'] = this.local_storage_info['search_obj']['start_date'];
        }
        if (this.local_storage_info['search_obj']['end_date']) {
          this.search_obj['end_date'] = this.local_storage_info['search_obj']['end_date'];
        }
        if (this.local_storage_info['search_obj']['search_value']) {
          this.placeholder = this.local_storage_info['search_obj']['search_value'];
        }
      } else if (this.local_storage_info.type == 'Item#' && this.local_storage_info['search_obj'] && this.local_storage_info['search_obj']) {
        this.searchCtrl.patchValue(this.local_storage_info['search_obj']['item_number']);
      } else if (this.local_storage_info.type == 'Product Name' && this.local_storage_info['search_obj'] && this.local_storage_info['search_obj']) {
        this.searchCtrl.patchValue(this.local_storage_info['search_obj']['product_name']);
      }
    }
  }

  subscribeContainerChoosed() {
    this.container_subscription = this.orderService.containe_number_msg.subscribe(
      (container_number) => {
        this.container_number = this.container_number;
        // this.search_obj = {
        //   container_number
        // };
        this.precise_search = true;
        this.choiceCtrl.setValue(this.choices[1]);
        this.searchCtrl.setValue(container_number);
        this.search_obj['precise'] = 1;
        this.container_mode = true;
        this.searchOrderItemShipping();
        this.precise_search = false;

      }
    )
  }

  searchVender() {
    this.isLoading = true;
    this.companyService.searchCompany(this.vendorName).subscribe(
      res => {
        this.isLoading = false;
        this.vendorId = res.data[0].id;
        this.getSharedOrderList(this.vendorId);
      }
    )
  }

  subscribeValueChange() {
    this.searchCtrl.valueChanges
      .debounceTime(600)
      // .distinctUntilChanged()
      .subscribe((term) => {

        this.backToTop();
        if (this.is_inital) {
          this.getLocalStorageSearchValue();
        }

        if (this.choiceCtrl.value == 'PO#') {
          if (!this.is_inital) {
            this.search_obj['purchase_order_number'] = term;
          } else {
            this.getLocalStorage();
          }
          this.searchOrder();
        } else if (this.choiceCtrl.value == 'PO#' && !this.searchCtrl.value) {
          this.getProductList();
        } else if (this.choiceCtrl.value == 'Container#') {
          this.cleanDate();
          if (!this.is_inital) {
            this.search_obj['container_number'] = term;
          } else {
            this.getLocalStorage();
          }
          this.searchOrderItemShipping();
        } else if (this.choiceCtrl.value == 'Item#') {
          if (!this.is_inital) {
            this.search_obj['item_number'] = term;
          } else {
            this.getLocalStorage();
          }
          this.searchOrder();
        } else if (this.choiceCtrl.value == 'Product Name') {
          if (!this.is_inital) {
            this.search_obj['product_name'] = term;
          } else {
            this.getLocalStorage();
          }
          this.searchOrder();
        }
      });
  }

  subscribeChoieChange() {
    this.choiceCtrl.valueChanges.subscribe(val => {
      // if (!this.is_inital) {
      //   this.resetSearchData();
      // }
      if (val == this.choices[0] && !this.precise_search) {
        this.setSearchBar('', 'Search By PO#');
        this.selectedContainer = null;
        this.container_mode = false;
        if (!this.containerToOrder && !this.searchCtrl.value) {
          this.getProductList();
        } else {
          this.containerToOrder = false;
        }
      } else if (val == this.choices[1] && !this.precise_search) {
        this.container_mode = true;
        // this.getContainers();
        this.setSearchBar('', 'Search Container#');
        if (!localStorage['Container#']) {
          this.searchCtrl.setValue('');
        }
      } else if (val == this.choices[2]) {
        this.container_mode = false;
        this.setSearchBar('', 'Search By Order Date');
        this.selectedContainer = null;

        this.searchCtrl.setValue('');
        this.searchOrder();
        // this.getProductList();
      } else if (this.choiceCtrl.value == 'Pending') {
        this.filterByDefault(0);
        this.setSearchBar('', 'Search By Pending');
        this.selectedContainer = null;
        this.container_mode = false;
      } else if (this.choiceCtrl.value == 'Prepaing') {
        this.filterByDefault(1);
        this.setSearchBar('', 'Search By Prepaing');
        this.selectedContainer = null;
        this.container_mode = false;

      } else if (this.choiceCtrl.value == 'Production') {
        this.filterByDefault(2);
        this.setSearchBar('', 'Search By Production');
        this.selectedContainer = null;
        this.container_mode = false;
      } else if (this.choiceCtrl.value == 'On The Ocean') {
        this.filterByDefault(3);
        this.setSearchBar('', 'Search By On The Ocean');
        this.selectedContainer = null;
        this.container_mode = false;

      } else if (this.choiceCtrl.value == 'Clearance') {
        this.filterByDefault(4);
        this.setSearchBar('', 'Search By Clearance');
        this.selectedContainer = null;
        this.container_mode = false;

      } else if (this.choiceCtrl.value == 'Ground') {
        this.filterByDefault(5);
        this.setSearchBar('', 'Search By Ground');
        this.selectedContainer = null;
        this.container_mode = false;

      } else if (this.choiceCtrl.value == 'Arrived') {
        this.filterByDefault(6);
        this.setSearchBar('', 'Search By Arrived');
        this.selectedContainer = null;
        this.container_mode = false;

      } else if (this.choiceCtrl.value == 'Finished') {
        this.filterByDefault(7);
        this.setSearchBar('', 'Search By Finished');
        this.selectedContainer = null;
        this.container_mode = false;

      } else if (this.choiceCtrl.value == 'Item#') {
        this.setSearchBar('', 'Search By Item#');
        this.selectedContainer = null;
        this.container_mode = false;
        if (!this.is_inital) {
          this.searchCtrl.patchValue('');
        }
        if (!this.containerToOrder) {
          this.getProductList();
        } else {
          this.containerToOrder = false;
        }

      } else if (this.choiceCtrl.value == 'Product Name') {
        this.setSearchBar('', 'Search By Product Name');
        this.selectedContainer = null;
        this.container_mode = false;
        if (!this.is_inital) {
          this.searchCtrl.patchValue('');
        }
        if (!this.containerToOrder) {
          this.getProductList();
        } else {
          this.containerToOrder = false;
        }

      }

    });
  }

  getPreviousViewOrder() {
    if (this.orders && this.orders[0].previous_view_order) {
      this.open(null, this.orders[0]);
    }
  }

  navToAttOrNote(data, order) {
    if (data.type == 'notes') {
      this.router.navigate([`${order.id}/item/${data.item.id}/notes/notesSubject`], { relativeTo: this.route });
    } else {
      this.router.navigate([`${order.id}/item/${data.item.id}/attachments`], { relativeTo: this.route });
    }
  }

  ngOnDestroy() {
    this.container_subscription.unsubscribe();
  }

  onGetOrderNumber(order_number) {
    this.choiceCtrl.setValue('PO#');
    this.search_obj['precise'] = 1;
    this.precise_search = true;
    this.searchCtrl.setValue(order_number);
    this.selectedContainer = null;
    this.container_mode = false;
    this.precise_search = false;
    this.containerToOrder = true;
  }

  getContainers() {
    this.isLoading = true;
    let customer_id;
    if (this.customer_id !== 0) {
      customer_id = this.customer_id;
    }
    this.inventoryService.getAllCotainers(this.id, customer_id).subscribe(
      res => {
        this.isLoading = false;
        this.containers = res.data;
        if (res.paging.next) {
          this.next = res.paging.next;
        }
      }
    )
  }

  onGetWheel(evt) {
    if (evt.target.scrollTop > this.refreshHeight) {
      if (this.next) {
        this.refreshHeight += 500;
        this.isLoading = true;
        this.orderService.getNext(this.next).subscribe(
          (res) => {
            this.isLoading = false;
            // this.nextOrders = res;
            // this.getOrderItems();
            if (res.paging) {
              this.next = res.paging.next;
            }

            this.containers = this.containers.concat(res.data);
          }
        )
      }
    }
  }

  navToDetail(order_id) {
    if (!this.vendorName) {
      this.router.navigate([order_id], { relativeTo: this.route });
    }
  }


  navToStatus(item, order_id) {
    this.router.navigate([order_id, 'item', item.id], { relativeTo: this.route });
  }

  backToTop() {
    let content = document.getElementById('content');
    if (content) {
      content.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  resetSearchData() {
    this.search_obj = {};
    this.filterValue = '';
    this.selectedContainer = null;
    this.selecedContainerItems = null;;
  }

  ngOnChanges() {
    this.getPreviousViewOrder();
  }

  onGetProcess(isLoading) {
    this.isLoading = isLoading;
  }

  showFilter() {
    this.showFilterModal = !this.showFilterModal;
  }

  setSearchBar(filterValue, placeholder) {
    this.showFilterModal = false;
    if (this.choiceCtrl.value == 'Date' || this.choiceCtrl.value == 'Status' || this.choiceCtrl.value == 'Container#') {
      this.filterValue = filterValue;
      this.placeholder = placeholder;
    }
    // if (this.choiceCtrl.value == this.choices[0]) {
    this.placeholder = placeholder;
    // }
  }

  isExpand(order) {
    return this.openOrder == order;
  }

  calculateNotes(order) {
    let count = 0;
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        if (item.notes_subjects && item.notes_subjects.length > 0) {
          count += item.notes_subjects.length;
        }
      });
    }
    order['notes_count'] = count;
  }

  calculateAttachements(order) {
    let count = 0;
    if (order.items) {
      order.items.forEach(item => {
        if (item.attachments && item.attachments.length > 0) {
          item.attachments.forEach(attachment => {
            if (attachment.name != 'upload_level_up.png') {
              count++;
            }
          })
        }
      });
    }
    this.calculateNotes(order);
    order['attachment_count'] = count;
  }

  open(event, order) {
    // event.stopPropagation();
    if (this.openOrder == order) {
      this.openOrder = '';
    } else {
      this.openOrder = order;
      this.orderService.getOrderDetail(this.id, order.id).subscribe(
        res => {

        },
        (err) => {
          
        }
      )

    }
  }

  isUnread(order) {
    if(this.openOrder == '' || this.openOrder != order) {
      for(let i = 0; i < order.items.length; i++) {
        let item = order.items[i];
        for(let j = 0; j < item.container_information.length; j++) {
          let info = item.container_information[j];
          if(info.is_unread) {
            //console.log(info.is_unread);
            return true;
          }
        }
        for(let j = 0; j < item.production_schedule_subjects.length; j++) {
          let schedule = item.production_schedule_subjects[j].schedules;
          for(let k = 0; k < schedule.length; k++) {
              if(schedule[k].is_unread) {
                //console.log(schedule[k].is_unread);
                return true;
              }
          }
        }
      }
    }
    return false;
  }

  cleanDate() {
    if (this.search_obj) {
      Object.keys(this.search_obj).forEach((key) => {
        if (key.includes('date')) {
          delete this.search_obj[key];
        }
      })
    }

  }

  filterByDefault(type) {
    this.cleanDate();
    this.backToTop();

    switch (type) {
      case 'po':
        this.setSearchBar('', 'Search By PO#');
        break;
      case 'yesterday':
        this.setSearchBar('yesterday', 'Search By Date');
        this.search_obj['start_date'] = this.yesterdayBegin();
        this.search_obj['end_date'] = this.currentDay;
        break;
      case 'lastweek':
        this.setSearchBar('lastweek', 'Search By Date');
        this.search_obj['start_date'] = this.lastweekbegin();
        this.search_obj['end_date'] = this.lastweekend();
        break;
      case 'lastmonth':
        this.setSearchBar('lastmonth', 'Search By Date');
        this.search_obj['start_date'] = this.lastmonthbegin();
        this.search_obj['end_date'] = this.lastmonthend();
        break;
      case 'today':
        this.setSearchBar('Today', 'Search By Date');
        this.search_obj['start_date'] = this.currentDay;
        this.search_obj['end_date'] = this.currentDate;
        break;
      case 'lastmonth':
        this.setSearchBar('Last Month', 'Search By Date');
        this.search_obj['start_date'] = this.lastmonthbegin();
        this.search_obj['end_date'] = this.lastmonthend();
        break;
      case 'weektodate':
        this.setSearchBar('Week To Date', 'Search By');
        this.search_obj['start_date'] = this.weektodate();
        this.search_obj['end_date'] = this.currentDate;
        break;
      case 'monthtodate':
        this.setSearchBar('Month To Date', 'Search By');
        this.search_obj['start_date'] = this.monthtodate();
        this.search_obj['end_date'] = this.currentDate;
        break;
      case 'quartertodate':
        this.setSearchBar('Quarter To Date', 'Search By');
        this.search_obj['start_date'] = this.weektoquarter();
        this.search_obj['end_date'] = this.currentDate;
        break;
      case 'yeartodate':
        this.setSearchBar('Quarter To Date', 'Search By');
        this.search_obj['start_date'] = this.yeartodate();
        this.search_obj['end_date'] = this.currentDate;
        break;
      case 'custom':
        this.setSearchBar('Custom Date Search', 'Search By');
        this.search_obj['start_date'] = this.customStartDate();
        this.search_obj['end_date'] = this.customEndDate();
        break;
    }

    if (typeof type == 'number') {
      this.setSearchBar('Status Search', 'Search By Status');
      if (type != -1) {
        this.search_obj['order_items_status'] = type;
      } else {
        if (this.search_obj['order_items_status']) {
          delete this.search_obj['order_items_status'];
        }
      }
      this.searchOrder();
    } else if (this.choiceCtrl.value != 'Container#') {
      this.searchOrder();
    } else {
      this.searchOrderItemShipping();
    }

  }

  searchOrder() {
    this.isLoading = true;

    if (this.customer_id) {
      this.search_obj['customer_id'] = this.customer_id;
    }

    if (this.is_inital && this.local_storage_info && this.local_storage_info['search_obj']) {
      this.search_obj = this.local_storage_info['search_obj'];
    }

    this.removeUnmatchSearchProperty()

    let queryString = '';

    Object.keys(this.search_obj).forEach(key => {
      if (queryString.length > 1) {
        queryString = queryString + '&' + key + '=' + this.search_obj[key];
      } else {
        queryString = queryString + key + '=' + this.search_obj[key];
      }
    })

    if (this.is_inital) {
      queryString += `&page=${this.currentPage}`;
    }

    this.searchService.searchOrder(this.id, queryString).subscribe(
      (res) => {
        this.refreshHeight = 150;
        this.isLoading = false;
        this.orders = res.data;
        console.log(this.orders);
        if (this.orders) {
          this.orders.forEach(order => {
            this.calculateAttachements(order);
            if (order.id == order.previous_view_order.order_id) {
              this.open(null, order);
              this.selectOrder(order);
            }
          });
        }
        this.next = res.paging.next;
        this.nextPageUrl = res.paging.next;

        this.is_inital = false;
        this.currentPage = res.paging.current_page;
        this.lastPageUrl = res.paging.previous;
        this.nextPageUrl = res.paging.next;
        this.lastPageNumber = res.paging.last_page;

        let local_storage_info = {};
        local_storage_info['type'] = this.choiceCtrl.value;
        local_storage_info['company_id'] = this.id;
        local_storage_info['search_obj'] = this.search_obj;
        local_storage_info['current_page'] = res.paging.current_page;
        local_storage_info['last_page'] = res.paging.last_page;
        local_storage_info['previous'] = res.paging.previous;
        local_storage_info['next'] = res.paging.next;
        local_storage_info['search_value'] = this.placeholder;
        localStorage.setItem('order', JSON.stringify(local_storage_info));

      },
      (err) => {
        localStorage.removeItem('order');
      }
    )
  }

  removeUnmatchSearchProperty() {
    if (!this.is_inital && this.local_storage_info && this.local_storage_info['search_obj']) {
      delete this.local_storage_info['search_obj']['precise'];
    }
    switch (this.choiceCtrl.value) {
      case 'PO#':
        delete this.search_obj['container_number'];
        delete this.search_obj['order_items_status'];
        delete this.search_obj['start_date'];
        delete this.search_obj['end_date'];
        delete this.search_obj['item_number'];
        delete this.search_obj['product_name'];
        break;
      case 'Container#':
        delete this.search_obj['order_items_status'];
        delete this.search_obj['start_date'];
        delete this.search_obj['end_date'];
        delete this.search_obj['item_number'];
        delete this.search_obj['product_name'];
        delete this.search_obj['purchase_order_number'];
        break;
      case 'Date':
        delete this.search_obj['order_items_status'];
        delete this.search_obj['container_number'];
        delete this.search_obj['item_number'];
        delete this.search_obj['product_name'];
        delete this.search_obj['purchase_order_number'];
        break;
      case 'Item#':
        delete this.search_obj['order_items_status'];
        delete this.search_obj['start_date'];
        delete this.search_obj['end_date'];
        delete this.search_obj['container_number'];
        delete this.search_obj['product_name'];
        delete this.search_obj['purchase_order_number'];
        break;
      case 'Product Name':
        delete this.search_obj['order_items_status'];
        delete this.search_obj['start_date'];
        delete this.search_obj['container_number'];
        delete this.search_obj['end_date'];
        delete this.search_obj['item_number'];
        delete this.search_obj['purchase_order_number'];
        break;
      default:
        delete this.search_obj['container_number'];
        delete this.search_obj['start_date'];
        delete this.search_obj['end_date'];
        delete this.search_obj['purchase_order_number'];
        delete this.search_obj['item_number'];
        delete this.search_obj['product_name'];
    }
  }

  getOrderItems() {
    this.orders.forEach(order => {
      this.orderService.getOrderItems(this.id, order.id).subscribe(
        (res) => {
          this.isLoading = false;
          order.items = res;
          // this.openOrderProcess.emit(false);
        },
        (err) => {
        }
      )
    })
  }

  getSingleOrderItems(order) {
    this.isLoading = true;
    this.orderService.getOrderItems(this.id, order.id).subscribe(
      (res) => {
        this.isLoading = false;
        order.items = res;
        // this.openOrderProcess.emit(false);
      },
      (err) => {
      }
    )
  }

  searchOrderItemShipping() {
    this.isLoading = true;
    if (this.customer_id) {
      this.search_obj['customer_id'] = this.customer_id;
    }
    this.removeUnmatchSearchProperty();
    if (this.is_inital) {
      this.search_obj = this.local_storage_info['search_obj'];
    }
    let queryString = '';
    if (this.search_obj && this.search_obj['container_number']) {
      this.search_obj['container_number'] = encodeURIComponent(this.search_obj['container_number']);
    }
    queryString = this.convertObjectToQuery(this.search_obj, queryString);
    if (this.is_inital) {
      queryString += `&page=${this.currentPage}`;
    }

    this.searchService.searchOrderItemShipping2(this.id, queryString).subscribe(
      (res) => {
        this.refreshHeight = 150;
        this.isLoading = false;
        this.containers = res.data;
        this.next = res.paging.next;
        if (this.containers.length == 0) {
          this.selectedContainer = res;
          this.selecedContainerItems = res;
        }

        this.is_inital = false;
        this.currentPage = res.paging.current_page;
        this.lastPageUrl = res.paging.previous;
        this.nextPageUrl = res.paging.next;
        this.lastPageNumber = res.paging.last_page;
        let local_storage_info = {};
        local_storage_info['type'] = this.choiceCtrl.value;
        local_storage_info['company_id'] = this.id;
        local_storage_info['search_obj'] = this.search_obj;

        local_storage_info['current_page'] = res.paging.current_page;
        local_storage_info['last_page'] = res.paging.last_page;
        local_storage_info['previous'] = res.paging.previous;
        local_storage_info['next'] = res.paging.next;

        localStorage.removeItem('order');
        localStorage.setItem('order', JSON.stringify(local_storage_info));
      },
      (err) => {
        localStorage.removeItem('order');
      })
  }

  setUserPreviousViewContainer(container) {
    this.authService.getCurrentUserBrief().subscribe(
      res => {
        let user_pre_view_container = {
          user_id: res.id,
          container_num: container.container_number
        };
        localStorage.setItem('user_pre_view_container', JSON.stringify(user_pre_view_container));
      }
    )
  }

  convertObjectToQuery(search_obj, queryString) {
    if (search_obj) {
      Object.keys(search_obj).forEach(key => {
        if (search_obj[key]) {
          if (queryString.length > 1) {
            queryString = queryString + '&' + key + '=' + search_obj[key];
          } else {
            queryString = queryString + key + '=' + search_obj[key];
          }
        }
      })
    }
    return queryString;
  }
  // onSelectContiainer(container) {
  //   this.isLoading = true;
  //   let container_number = encodeURIComponent(container.container_number);
  //   this.orderService.getOrderItemShipping(this.id, container_number).subscribe(
  //     res => {
  //       this.isLoading = false;
  //       this.selectedContainer = res.container;
  //       this.selecedContainerItems = res.order_items;
  //     }
  //   )
  // }

  onGetItems(container) {
    this.setUserPreviousViewContainer(container);

    this.isLoading = true;
    this.orderService.getContainerItems(this.id, container.container_number).subscribe(
      (res) => {
        this.isLoading = false;
        container['items'] = res.data;
        container['items'].forEach(item => {
          this.getOrder(item);
        })
      }
    )
  }

  getOrder(item) {
    this.orderService.getOrderDetail(this.id, item.order_id).subscribe(
      (res) => {
        item['purchase_order_number'] = res.purchase_order_number;
      },
      (err) => {
      }
    )
  }

  getPage(){
    return this.currentPage + '/' + this.lastPageNumber;
  }

  getProductList() {
    this.isLoading = true;
    this.showFilterModal = false;
    this.orderService.getOrders(this.id, this.accountId).subscribe(
      (res) => {
        this.refreshHeight = 150;
        this.orders = res.data;
        // this.getOrderItems();
        if (this.orders) {
          this.orders.forEach(order => {
            this.calculateAttachements(order);
          });
        }
        this.next = res.paging.next;
        this.isLoading = false;


        this.is_inital = false;
        this.currentPage = res.paging.current_page;
        this.lastPageUrl = res.paging.previous;
        this.nextPageUrl = res.paging.next;
        this.lastPageNumber = res.paging.last_page;

        let local_storage_info = {};
        local_storage_info['type'] = 'getProductList';
        local_storage_info['company_id'] = this.id;
        local_storage_info['search_obj'] = this.search_obj;
        local_storage_info['current_page'] = res.paging.current_page;
        local_storage_info['last_page'] = res.paging.last_page;
        local_storage_info['previous'] = res.paging.previous;
        local_storage_info['next'] = res.paging.next;
        localStorage.setItem('order', JSON.stringify(local_storage_info));
      },
      (err) => {
      }
    );
  }

  getSharedOrderList(companyId) {

    this.isLoading = true;
    this.orderService.getSharedOrder(companyId, this.id).subscribe(
      res => {
        this.isLoading = false;
        this.orders = Object.values(res);
      }
    )
  }

  selectOrder(order) {
    this.selectedOrder = order;
    // this.open(order);
  }

  setCust(order) {
    this.orderService.setSelectOrderCustomer(order.customer);
  }

  //load another 15 orders when scroll down mouse
  // old version on mouse wheel !!!!!!!!!!!!!!!!!!!!
  oldVersionOnMouseWheel(evt) {
    // first step, write scroll_position to the local storage, editted by yali
    localStorage.setItem('scroll_position', evt.target.scrollTop);

    // not used now, editted by yali
    // console.log(evt.target.scrollTop, this.refreshHeight);
    // console.log('hehe', evt.target.scrollTop);
    // if (evt.target.scrollTop > this.refreshHeight) {
    //   if (this.next && !this.isLoading) {
    //     this.refreshHeight += 500;
    //     this.isLoading = true;

    //     this.orderService.getNextOrders(this.next).subscribe(
    //       (res) => {
    //         this.isLoading = false;
    //         this.nextOrders = res;
    //         // this.getOrderItems();
    //         if (this.nextOrders.paging) {
    //           this.next = this.nextOrders.paging.next;
    //         }

    //         this.orders = this.orders.concat(this.nextOrders.data);
    //       }
    //     )
    //   }
    // }
  }

  onMouseWheel(evt) {
    // first step, write scroll_position to the local storage, editted by yali
    localStorage.setItem('scroll_position', evt.target.scrollTop);
    // not used now, editted by yali
    // console.log('hehe', evt.target.scrollTop);

    // if (evt.target.scrollTop > this.refreshHeight) {
    //   if (this.next && !this.isLoading) {
    //     this.refreshHeight += 500;
    //     this.isLoading = true;

    //     this.orderService.getNextOrders(this.next).subscribe(
    //       (res) => {
    //         this.isLoading = false;
    //         this.nextOrders = res;
    //         // this.getOrderItems();
    //         if (this.nextOrders.paging) {
    //           this.next = this.nextOrders.paging.next;
    //         }

    //         this.orders = this.orders.concat(this.nextOrders.data);
    //       }
    //     )
    //   }
    // }
  }

  // thrid step, get scroll_position from the local storage, and jump to the location
  backToLocation() {

    // second step, add id="content" at html at the location where the onMouseWheel function is called, editted by yali
    let content = document.getElementById('content');
    let content2 = document.getElementById('content2');
    if (!content) {
      content = content2;
    }
    let scroll_position = +localStorage.getItem("scroll_position");
    if (content) {
      content.scrollTo({ top: scroll_position, left: 0, behavior: 'auto' });
    }
  }

  resetOrderForm() {
    this.orderService.resetOrderFormInfo();
    this.orderService.resetLocalOrderItems();
    this.orderService.resetLocalSharedContacts();
    this.orderService.resetCustomerAccount();
  }

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

  updatePriority(event, order) {
    event.stopPropagation();
    this.orderService.updateOrderPriority(this.id, order.id).subscribe(
      res => {
        order['priority'] = res.priority;
      }
    )
  }

  getColor(order) {
    let priority = order.priority;
    if (priority == 0) {
      return 'lightgray';
    } else if (priority == 1) {
      return 'gold';
    } else {
      return '#c82333';
    }
  }

  previousPage() {
    if (this.currentPage == 1) return;
    this.currentPage = this.currentPage - 1;
    this.getCustomizePage();
  }

  nextPage() {
    if (this.currentPage == this.lastPageNumber) return;
    localStorage.setItem('scroll_position', '0');
    this.currentPage = this.currentPage + 1;
    this.getCustomizePage();
  }

  firstPage() {
    // if (this.choiceCtrl.value == 'PO#') {
      this.currentPage = 1;
      this.getCustomizePage();
    // }
  }

  lastPage() {
    // if (this.choiceCtrl.value == 'PO#') {
      this.currentPage = this.lastPageNumber;
      this.getCustomizePage();
    // }
  }

  exactPage(pageNumber) {
    this.currentPage = pageNumber;
    this.getCustomizePage();
  }

  getCustomizePage() {
    this.isLoading = true;
    this.is_inital = true;
    switch (this.choiceCtrl.value) {
      case 'Container#':
        this.searchOrderItemShipping();
        break;
      default:
        this.searchOrder();
    }

  }
  getUnreadAttachments() {
    //http://18.188.206.26/company/6/order_item/64/attachments
  }

}
