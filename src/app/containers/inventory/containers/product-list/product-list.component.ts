import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from './../../../../core/models/index';
import { Warehouse } from 'app/core/models/warehouse';
import { CommonService } from 'app/core/services/common.service';

import { WarehouseService } from 'app/core/services/warehouse.service';
import { InventoryService } from './../../../../core/services/inventory.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { FormControl } from '@angular/forms';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ShopService } from '../../../../core/services/shop.service';
import { SearchService } from '../../../../core/services/search.service';
import { AddWarehouseTransactionComponent } from '../add-warehouse-trans/add-warehouse-trans.component';
// import { Ng2Ueditor } from 'ng2-ueditor';
// import { ProductEditComponent } from '../product-edit/product-edit.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {
  company_id: number;
  productList: Product[];
  warehouses: Warehouse[];
  nextPagingUrl = '';
  selectedWarehouse: Warehouse;
  selectedProduct: Product;
  feedback;
  next = '';
  nextProducts = '';
  // @ViewChild('ueditor') ueditor: Ng2Ueditor;
  //warehouseMap = new Map<number, string>();
  //set maximum refresh height;
  refreshHeight: number = 400;
  // count mouse wheel
  countMouseWheel: number = 0;
  total: number;
  searchTerm: string = '';
  subscription: Subscription;
  searchCtrl: FormControl = new FormControl();
  searchProducts: Observable<any[]>;
  isLoading: boolean = false;
  prodcutSelectedType = 'all';
  selects = ["Private", "Company", "Public"];
  defaultSelect = "Private";
  placeholder = "Product Status";
  choiceCtrl: FormControl = new FormControl();

  options = ['Item#', 'Name', 'Description'];
  defaultOption = this.options[0];
  optionPlaceholder = 'Search Type';
  searchPlaceholder = 'Search By ' + this.options[0];
  isAddProd;
  isAddProduct;
  isAddService;
  isOpenDetail;
  isEdit: boolean;
  isSaveEdit: boolean;
  product_id: number;
  links = [
    {
      name: 'Add Product',
      url: '../addProduct',
      type: 'product',
    },
    {
      name: 'Add Service',
      url: '../addService',
      type: 'service',
    }
  ];
  constructor(private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private warehouseService: WarehouseService,
    private router: Router,
    private dialog: MatDialog,
    private commonService: CommonService,
    private shopService: ShopService,
    private searchService: SearchService
  ) {
    this.searchCtrl.valueChanges.subscribe(
      (term) => {
        this.onSearch(term);
        this.backToTop();
      }
    )
    this.company_id = + this.route.snapshot.paramMap.get('cid');
    this.init();
  }

  backToTop() {
    let content = document.getElementById('content');
    content.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  ngOnInit() {

  }

  onGetSearch(obj) {
    let option = obj.option, term = obj.term;
    let queryString = "";
    switch (option) {
      case "Name":
      case "Description":
        queryString = option.toLowerCase() + "=" + term;
        break;
      case "Item#":
        queryString = 'headline' + "=" + term;
        break
    }
    this.onSearch(queryString);
  }

  onSearch(queryString) {
    this.prodcutSelectedType = 'all';
    this.searchService.searchProduct(this.company_id, queryString).subscribe(
      (res) => {
        this.refreshHeight = 400;
        this.productList = res.data;
        this.next = res.paging.next;
      }
    )
  }

  init() {
    this.getWarehouses();
    this.getProducts();
    this.isAddProduct = false;
    this.isAddService = false;
    this.isOpenDetail = false;
    this.isAddProd = false;
    this.isEdit = false;
    this.isSaveEdit = false;
  }

  addProduct() {
    this.init();
    this.isAddProd = true;
  }

  addItem(link) {
    this.init();
    if (link.type == "product") {
      this.isAddProduct = true;
    } else if (link.type == 'service') {
      this.isAddService = true;
    }
  }
  saveItem() {
    this.router.navigate([`/company/${this.company_id}/inventory/product`]);
    this.init();
  }

  onCancel() {
    this.init();
    this.router.navigate([`/company/${this.company_id}/inventory/product`]);
  }
  openEdit() {
    this.init();
    this.isEdit = true;
  }
  saveEdit(saved: boolean) {
    this.init();
  }
  changeProduct(showcase) {
    // product-> 
    // as_showcase-> 
    // 0  - private
    // 1  - company
    // 2  - public
    // 3  - showcase
    // 4  - shop
    // 5  - >=0 (not private, only showcase frontend)

    if (showcase == 0) {
      this.prodcutSelectedType = 'private';
    } else if (showcase == 1) {
      this.prodcutSelectedType = 'company';

    } else if (showcase == 2) {
      this.prodcutSelectedType = 'public';
    }
    this.isLoading = true;
    this.inventoryService.getProductByShowcase(this.company_id, showcase).subscribe(
      (res) => {
        this.productList = res.data;
        this.next = res.paging.next;
        this.isLoading = false;
        this.backToTop();
      }
    )
  }

  onGetSelect(statusObj, product_id) {
    let status = statusObj.status.toLowerCase();
    let obj;
    if (status == 'private') {
      obj = { as_showcase: 0 };
    } else if (status == 'company') {
      obj = { as_showcase: 1 };
    } else if (status == 'public') {
      obj = { as_showcase: 2 };
    } else if (status == 'show case') {
      obj = { as_showcase: 3 };
    } else if (status == 'shop') {
      obj = { as_showcase: 4, shop_status: 1 };
    }
    if (obj) {
      this.updateProductStatus(product_id, obj);
    }
  }

  updateProductStatus(product_id, obj) {
    this.isLoading = true;
    this.inventoryService.editProduct(this.company_id, product_id, obj).subscribe(
      (res) => {
        this.isLoading = false;
        this.init();
      }
    )
  }

  onNavToDetail($event, id) {
    this.product_id = +id;
    // console.log(this.product_id);
    $event.stopPropagation();
    // if (id) {
    //   this.router.navigateByUrl(`/company/${this.company_id}/inventory/product/${id}`);
    // }
    this.isAddProduct = false;
    this.isAddService = false;
    this.isAddProd = false;
    this.isEdit = false;
    this.isSaveEdit = false;
    this.isOpenDetail = true;
  }

  onMouseWheel(evt) {
    if (evt.target.scrollTop > this.refreshHeight) {
      if (this.next && !this.isLoading) {
        this.refreshHeight += 400;
        this.getPagingProducts();
      }
    }
  }

  getProducts() {
    this.prodcutSelectedType = 'all';
    this.isLoading = true;
    this.inventoryService.getProductList(this.company_id).subscribe(
      (res) => {
        this.backToTop();
        this.refreshHeight = 400;
        this.productList = res.data;
        this.next = res.paging.next;
        this.isLoading = false;
      }
    )
  }

  getPagingProducts() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.inventoryService.getPagingProducts(this.next).subscribe(
        (res) => {
          this.isLoading = false;
          this.productList = this.productList.concat(res.data);
          this.next = res.paging.next;
        },
        (err) => {
          this.isLoading = false;
        }
      )
    }

  }

  getWarehouses() {
    this.isLoading = true;
    this.warehouseService.getWarehouseCollection(this.company_id).subscribe(
      (res) => {
        this.isLoading = false;
        this.refreshHeight = 400;
        this.warehouses = res.data;
        let next = res.paging.next;
        this.prodcutSelectedType = 'all';
        if (res.paging && next) {
          this.nextPagingUrl = next;
          this.getNextWarehouses(this.nextPagingUrl);
        }
      }
    )
  }

  getNextWarehouses(nextUrl) {
    this.isLoading = true;
    this.warehouseService.getNextWarehouses(nextUrl).subscribe(
      (res) => {
        this.isLoading = false;
        this.warehouses = this.warehouses.concat(res.data);
        this.nextPagingUrl = res.paging.next;
        if (this.nextPagingUrl) {
          this.getNextWarehouses(this.nextPagingUrl);
        }
      }
    )
  }

  selectProduct(product) {
    this.total = 0;
    this.selectedProduct = product;
    this.getProductWarehouses(this.selectedProduct);
    this.total = product.total_amount;
  }

  checkDefault(product) {
    let res = '';
    if (product.as_showcase == 0) {
      res = this.selects[0];
    } else if (product.as_showcase == 1) {
      res = this.selects[1];
    } else if (product.as_showcase >= 2) {
      res = this.selects[2];
    }
    return res;
  }

  getProductWarehouses(product) {
    this.isLoading = true;
    this.inventoryService.getProductInfo(this.company_id, product.id).subscribe(
      (res) => {
        this.isLoading = false;
        product.warehouses = res.warehouses;
        this.warehouses = product.warehouses;
      }
    )
  }

  onChangeWarehouse(warehouse) {
    this.isLoading = true;
    this.selectedWarehouse = warehouse;
    this.inventoryService.getAllProductsFromOneWarehouse(this.company_id, warehouse.id).subscribe(
      (res) => {
        this.isLoading = false;
        this.backToTop();
        this.refreshHeight = 400;
        this.productList = res.data;
        this.next = res.paging.next;
        // var content = document.getElementById('content');
        // content.scrollTop = 0;
      }
    )
  }

  openAddTransDialog(product_id, product_name) {
    const dialogRef = this.dialog.open(AddWarehouseTransactionComponent, {
      width: '700px',
      data: {
        company_id: this.company_id,
        warehouses: this.warehouses,
        product_id: product_id,
        product_name: product_name
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.reset();
      });
  }

  reset() {
    this.getProducts();
    this.getWarehouses();
    this.selectedWarehouse = null;
    this.selectedProduct = null;
    this.total = 0;
  }

}
