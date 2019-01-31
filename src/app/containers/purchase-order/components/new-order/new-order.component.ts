import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule
} from "@angular/forms";
import { Order_Item } from "app/core/models/index";
import { Location } from "@angular/common";
import { OrdersService } from "app/core/services/orders.service";
import { ToasterService } from 'app/core/services/toaster.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AccountService } from "../../../../core/services/account.service";
import { SearchService } from 'app/core/services/search.service';
import { LeadService } from "../../../../core/services/lead.service";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { CompanyService } from "../../../../core/services/company.service";

@Component({
  selector: "app-new-order",
  templateUrl: "./new-order.component.html",
  styleUrls: ["./new-order.component.scss"]
})

export class NewOrderComponent implements OnInit, OnDestroy {
  orderForm: FormGroup;
  id: number;
  currentLoginCompanyId;
  orderItems = [];
  orderFormInfo;
  order_date;
  company_defined_columns = [];

  sharedContacts;
  accountId;
  // accountCompanyId is the company_id of the accout
  // when share this order to the account's contact, need to post the accountCompanyId, 
  // editted by yali
  accountCompanyId;

  companyId;
  isLoading: boolean = false;
  searchCtrl: FormControl;
  next: string = '';
  choosingCustomer: boolean = true;
  showCustomer: boolean = false;
  accountlist$: Account[];
  countMouseWheel = 0;
  refreshHeight = 500;
  dest_type = 'dropship';
  Account$;
  selectChoices = [
    { value: '', viewValue: '' },
    { value: 'dropship', viewValue: 'Drop Ship to Customer' },
    { value: 'warehouse', viewValue: 'Ship to Warehouse' }
  ];
  showSelect: boolean = true;

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
    private accountService: AccountService,
    private searchService: SearchService,
    private companyService: CompanyService,
    private location: Location,
    private leadService: LeadService
  ) {

    this.accountId = this.route.snapshot.paramMap.get('cusid');
    this.companyId = +this.route.snapshot.paramMap.get('cid');
    this.orderFormInfo = this.ordersService.getOrderFormInfo();
    this.Account$ = this.ordersService.getCustomerAccount();
    if (this.Account$) {
      this.accountId = this.Account$.id;
      this.accountCompanyId = this.Account$.company_id;
    }
    if (this.router.url.includes('/crm')) {
      this.showSelect = false;
      this.selectChoices = [
        { value: '', viewValue: '' },
        { value: 'dropship', viewValue: 'Drop Ship to Customer' }
      ]
    }

    if (this.orderFormInfo) {
      this.order_date = this.orderFormInfo.order_date;
    }

    this.createOrderForm();
    this.getcurrentid();
    if (this.accountId) {
      this.getCustomerCompanyDetail();
    }
    this.orderItems = this.ordersService.getLocalOrderItems();
    this.sharedContacts = this.ordersService.getLocalSharedContacts();
    this.orderItems.forEach((each) => {
      this.changeObjectToArray(each.company_defined_columns);
    });

    this.searchCtrl = new FormControl();
    this.searchCtrl.valueChanges
    .debounceTime(600)
    .distinctUntilChanged()
    .subscribe(
      (term) => {
          this.onSearch(term);
      }
    )
  }

  onSearchCompany() {
    this.onSearch(this.searchCtrl.value);
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    setTimeout(() => {
      const buttonClick = document.getElementById("header-submit-edit");
      buttonClick.addEventListener("click", ($event) => {
        this.onSave();
        $event.preventDefault();
      });

      const cancelButtonClick = document.getElementById("header-cancel");
      cancelButtonClick.addEventListener("click", () => {
        this.reset();
        this.location.back();
      });
    }, 0);

    // this.getLeads();
  }

  // getLeads(){
  //   this.accountService.getAccountList(this.companyId).subscribe(
  //       res=>{
  //           this.accountlist$ = res.data;
  //           // console.log( res.data);
  //           this.isLoading = false;
  //           this.next = res.paging.next;
  //       },
  //       (err) => {
  //         console.log('bug in getleads');
  //       }
  //   )
  // }

  getCustomerCompanyDetail() {
    if (!this.currentLoginCompanyId) {
      this.currentLoginCompanyId = this.companyId;
    }
    this.accountService.getAccount(this.currentLoginCompanyId, this.accountId).subscribe(
      res => {
        this.Account$ = res;
        this.accountlist$ = [this.Account$];
        if (this.Account$ && this.Account$.name) {
          let custInfo = this.Account$.name + ' Tel: ' + this.Account$.telephone_number;
          this.orderForm.patchValue({
            customer_name: custInfo
            // destination: this.Account$.,
          })
          let id = +this.Account$.id;
          this.getAccountAddresses(id);
        }

        this.isLoading = false;
      }
    )

  }


  getAccountAddresses(account_id) {
    this.leadService.getLeadAddresses(this.currentLoginCompanyId, account_id).subscribe(
      (res) => {
        let addresses = '';

        if (res.data && (res.data.length > 0)) {
          res.data.forEach((address) => {
            let singleAddress = address.street1 + ', ' + address.city + ', ' + address.state + '; ';
            addresses += singleAddress;
          })
        }
        
        if(addresses){
          this.orderForm.patchValue({
            destination: addresses
          });
        }
      }
    )
  }

  public onMouseWheel(evt) {
    // if (evt.deltaY > 0) {
    //   this.countMouseWheel = this.countMouseWheel + evt.deltaY;
    // }
    // if(this.countMouseWheel > this.refreshHeight){
    //     //get my next page of leads
    //     if(this.next !=null)
    //     this.isDataLoading = true;
    //     this.refreshHeight = this.refreshHeight +1000;
    //     this.service.getAccountListnext(this.next).subscribe(
    //         res =>{
    //             this.accountList2 = res.data;
    //             for (var i = 0; i< this.accountList2.length; i++){
    //                 this.accountlist$.push(this.accountList2[i]);
    //             }
    //             this.next = res.paging.next;
    //             this.isDataLoading = false;
    //         },err =>{
    //             this.isLoading = false;
    //         }
    //     )
    // }
    console.log(evt);
    if (evt.target.scrollTop > this.refreshHeight) {
       //get my next page of leads
        if(this.next !=null && !this.isLoading)
        this.isLoading = true;
        this.refreshHeight = this.refreshHeight +1000;
        this.accountService.getAccountListnext(this.next).subscribe(
            res =>{
                let accountList2 = res.data;
                for (var i = 0; i< accountList2.length; i++){
                    this.accountlist$.push(accountList2[i]);
                }
                this.next = res.paging.next;
                this.isLoading = false;
            },err =>{
                this.isLoading = false;
            }
        )
    }
  }
  ngOnDestroy() {
    const old_element = document.getElementById("header-submit-edit");
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);

    const old_element2 = document.getElementById("header-cancel");
    var new_element2 = old_element2.cloneNode(true);
    old_element2.parentNode.replaceChild(new_element2, old_element2);

  }

  changeObjectToArray(obj) {
    let tempArr = [];
    let columnsObj = obj;
    if (columnsObj) {
      for (var prop in columnsObj) {
        tempArr.push({
          name: prop,
          value: columnsObj[prop]
        });
      }
    }
    this.company_defined_columns.push(tempArr);
  }

  createOrderForm() {
    this.orderForm = this.fb.group({
      searchCtrl: [""],
      dest_type: [""],
      customer_readonly_name: [""],
      customer_obj: [""],
      purchase_order_number: ["", Validators.required],
      sales_order_number: ["", Validators.required],
      customer_name: ["", Validators.required],
      order_date: ["", Validators.required],
      request_date: ["", Validators.required],
      destination: ["", Validators.required],
      customer_id: [""]
    });

    if (this.orderFormInfo) {
      this.orderForm = this.fb.group({
        dest_type: [this.orderFormInfo.dest_type],
        customer_obj: [this.orderFormInfo.customer_obj],
        customer_readonly_name: [this.orderFormInfo.customer_readonly_name],
        purchase_order_number: [this.orderFormInfo.purchase_order_number],
        sales_order_number: [this.orderFormInfo.sales_order_number],
        customer_name: [this.orderFormInfo.customer_name],
        order_date: [this.orderFormInfo.order_date],
        request_date: [this.orderFormInfo.request_date],
        destination: [this.orderFormInfo.destination],
        customer_id: [""]
      });
    }
  }

  reset() {
    this.ordersService.resetLocalOrderItems();
    this.ordersService.resetLocalSharedContacts();
    this.ordersService.resetOrderFormInfo();
    this.ordersService.resetCustomerAccount();
  }

  onGetSelected(account) {
    this.accountId = account.id;
    this.Account$ = account;
    this.ordersService.saveCustomerAccount(this.Account$);
    this.getCustomerCompanyDetail();
  }

  addOrderItem(orderItem) {
    this.orderItems.push(orderItem);
  }

  onSearch(term) {
    // this.searchService.searchAccountCompany(this.companyId, term, 'brief', '3').subscribe(
    //   res => {
    //     this.accountlist$ = res.data;
    //   }
    // )
    this.leadService.customerFilterByType(this.companyId, 'account', 'name', term).subscribe(
      res => {
          this.accountlist$ = res.data;
      }
    )
  }

  removeOrderItem(i: number) {
    this.ordersService.removeLocalOrderItem(i);
    this.company_defined_columns.splice(i, 1);
  }

  removeSharedContact(i: number) {
    this.ordersService.removeLocalSharedContacts(i);
  }

  onSave() {

    if (this.orderForm.valid && this.orderItems.length > 0 && ((this.orderForm.value.dest_type == 'warehouse') || this.Account$)) {

      (<HTMLButtonElement>document.getElementById('header-submit-edit')).disabled = true;

      this.orderForm.value.customer_id = this.accountId;
      let newOrder: Order_Item = this.orderForm.value;
      newOrder['order_items'] = this.orderItems;
      console.log(newOrder);
      // let companyId = this.currentLoginCompanyId;
      this.isLoading = true;
      // add inventory !
      if (this.orderForm.value.dest_type == 'warehouse') {
        this.orderForm.value.customer_id = 0;
      }
      this.ordersService.addOrder(newOrder, this.companyId).subscribe(
        (res) => {
          let newOrderId = res.id;
          // add new order items to order
          // if (this.orderItems) {
          //   let i;
          //   for (i = 0; i < this.orderItems.length; i++) {
          //     this.ordersService.addOrderItem(this.orderItems[i], this.companyId, newOrderId).subscribe(
          //       (res) => {
          //       },
          //       (err) => {

          //       }
          //     );
          //   }
          // }

          // share order
          if (this.sharedContacts.length != 0) {
            let emails = {
              "emails": this.sharedContacts,
              "company_id": this.accountCompanyId
            };
            this.ordersService.shareOrder(this.companyId, newOrderId, emails).subscribe(
              (res) => {
                this.isLoading = false;
              },
              (err) => {

              }
            );
          }

          // need to route to crm/account/orders, fix the bug later
          this.router.navigateByUrl(`/company/${this.companyId}/purchase-order/orders`).then((res) => {
            // reset localOrderItem, localSharedContacts and orderFormInfo on service
            this.ordersService.resetLocalOrderItems();
            this.ordersService.resetLocalSharedContacts();
            this.ordersService.resetOrderFormInfo();
            this.ordersService.resetCustomerAccount();
            this.toasterService.showToaster('Created Successfully!', '', 3000);
          });
        },
        (err) => {
        }
      );
    }
  }

  // get currentcompany id
  getcurrentid() {
    this.currentLoginCompanyId = localStorage.getItem("currentLoginCompanyId");
  }

  saveOrderFormInfo() {
    this.ordersService.saveOrderFormInfo(this.orderForm.value);
    this.ordersService.saveCustomerAccount(this.Account$);

    console.log(this.Account$);
    console.log(this.orderForm.value);
  }

  chooseCustomer(account) {
    this.accountId = account.id;
  }
}



