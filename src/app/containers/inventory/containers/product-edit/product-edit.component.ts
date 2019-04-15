import { Component, OnInit, OnChanges, AfterViewChecked, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Product } from './../../../../core/models/index';
import { Warehouse } from 'app/core/models/warehouse';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { InventoryService } from '../../../../core/services/inventory.service';
import { VrmBaBaService } from '../../../vrm/vrm.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MAT_DIALOG_DATA } from '@angular/material'
import { Observable } from 'rxjs/Observable';
import { SearchService } from '../../../../core/services/search.service';
import { CompanyService } from '../../../../core/services/company.service';
import { CopyService } from '../../../../core/services/copy.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { LeadService } from '../../../../core/services/lead.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})

export class ProductEditComponent implements OnInit, OnChanges {
  editProductForm: FormGroup;
  company_id: number;
  company_defined_columns = [];
  company_defined_columns_obj = {};
  imgs = [];
  isLoading: boolean = false;
  err: boolean = false;
  categories = [];
  selected_category;
  itemNumErr: string;
  category_array = [];
  @Input() product_id: number;
  unit_price_type_group = [
    {
      name: 'International',
      subGroup: [
        'Ex Work',
        'FOB Port',
        'CIF',
        'Deliver Price'
      ]
    },
    {
      name: 'Domestic',
      subGroup: [
        'Local',
        'FOB Warehouse'
      ]
    }
  ];
  units = ['cents', 'dollars'];
  venderList = [];
  separatorKeysCodes = [ENTER, COMMA];
  vender: Array<string> = [];
  selected_vender;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  filteredVenders;
  venderCtrl: FormControl = new FormControl();
  vender_company_addresses;
  show_select_vender: boolean = false;
  copy_product_info;
  product;
  initalImgs = [];
  showCustomerInput: boolean = false;
  customerIdErr: boolean = false;
  customerList = [];
  shipping_packaging_type = ["Bulk Pack", "Case Pack On Pallets", "Case Pack Floor Load"];
  show_packaging_type = "";
  pallet_sizes = ["40 * 48 Inch", "48 * 58 Inch"];
  selected_customer;
  customerCtrl: FormControl = new FormControl();
  filteredCustomers;
  isSave: boolean;
  @Output() saved = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private location: Location,
    private companyService: CompanyService,
    private searchService: SearchService,
    private vrmService: VrmBaBaService,
    private copyService: CopyService,
    private leadService: LeadService,
    private dialogService: DialogService
    ) {

    this.company_id = +this.route.snapshot.paramMap.get('cid');
    // this.product_id = +this.route.snapshot.paramMap.get('pid');
    this.getAllCategory();
    this.subscribeTermSearch();
  }

  subscribeTermSearch() {
    this.venderCtrl.valueChanges.subscribe(
      (term) => {
        this.onSearchVrm(term);
      }
    )

    this.customerCtrl.valueChanges.subscribe(
      term => {
        this.onSearchCrm(term);
      }
    )
  }
  saveItem() {
    this.isSave = true;
    this.saved.emit(this.isSave);
  }

  onSearchCrm(term) {
    // true meaning the user is admin
    // this.searchService.searchCRMCompany(this.company_id, term, true).subscribe(
    //   (res) => {
    //     this.filteredCustomers = res.data;
    //   }
    // )
    this.leadService.customerFilterByType(this.company_id, 'account', 'name', term).subscribe(
      res => {
        this.filteredCustomers = res.data;
      }
    )

  }

  ngOnInit() {
    setTimeout(() => {
      const buttonClick = document.getElementById("header-submit-edit");
      buttonClick.addEventListener("click", () => {
        this.onSave();
      });
    }, 0);
  }

  getSelectedCustomerInfo(customer) {
    this.customerList.pop();
    this.customerList.push(customer);
    //vender_id is the vender's id in companies table 
    this.editProductForm.patchValue({
      customer_id: customer.id
    })
    this.customerIdErr = false;
  }

  addCustomer(event: MatChipInputEvent): void {
    setTimeout(e => {
      const input = event.input;
      const value = this.selected_customer || event.value;
      // Add our email
      // this.addHelper(value);
      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.selected_customer = '';
    }, 0);
  }

  subscribeAsShowCaseBtn() {
    this.editProductForm.controls['as_showcase'].valueChanges.subscribe(
      val => {
        if (val == 0) {
          this.showCustomerInput = true;
        } else {
          this.showCustomerInput = false;
        }
      }
    )
  }

  getProduct() {
    this.isLoading = true;
    this.inventoryService.getProductInfo(this.company_id, this.product_id).subscribe(
      (res) => {
        this.isLoading = false;
        this.product = res;
        this.product.company_defined_columns = this.changeDefineColumnFormat(this.product.company_defined_columns);
        this.initalImgs = this.product.images;
        this.setProductInfo(this.product);
      }
    )
  }

  setVenderAndCustomer() {
    console.log(this.product.customer, this.product.vender);
    if (this.product.customer_id) {
      this.getSelectedCustomerInfo(this.product.customer);
    }
    if (this.product.vender_id) {
      this.getSelectedVenderInfo(this.product.vender);
    }
  }

  changeDefineColumnFormat(obj) {
    let res = [];
    for (var prop in obj) {
      res.push({
        name: prop,
        value: obj[prop]
      })
    }
    return res;
  }

  setProductInfo(product_info) {
    console.log(product_info.as_showcase);
    this.editProductForm.patchValue({
      name: product_info.name,
      headline: product_info.headline,
      description: product_info.description,
      vender_id: product_info.vender_id,
      customer_id: product_info.customer_id,
      category: "",
      category_id: "",
      as_showcase: +product_info.as_showcase,
      images: [],
      qty_in_20_container: product_info.qty_in_20_container,
      qty_in_40_container: product_info.qty_in_40_container,
      unit_price_type: product_info.unit_price_type,
      est_cost: product_info.est_cost / 100000,
      unit: 'dollars',
      manufacturer_item_number: product_info.manufacturer_item_number,
      vender_address_id: product_info.vender_address_id,
      company_defined_columns: this.fb.group(this.company_defined_columns_obj),
      shipping_packaging_type: product_info.shipping_packaging_type,
      pallet_size: this.setPalletSize(product_info.pallet_size),
      pcs_per_case: product_info.pcs_per_case,
      pcs_per_layer: product_info.pcs_per_layer,
      cases_per_layer: product_info.cases_per_layer,
      layer_per_pallet: product_info.layer_per_pallet,
      cases_per_20_container: product_info.cases_per_20_container,
      cases_per_40_container: product_info.cases_per_40_container,
      pallets_per_20_container: product_info.pallets_per_20_container,
      pallets_per_40_container: product_info.pallets_per_40_container
    })
    product_info.company_defined_columns.forEach(define_column => {
      if (define_column.value != 'NULL') {
        (<FormGroup>this.editProductForm.controls['company_defined_columns']).controls[define_column.name].patchValue(define_column.value);
      }
    })
    this.getProductAllCateogories();
    this.setVenderAndCustomer();
  }

  setPalletSize(pallet_size) {
    if (!pallet_size) return "";
    this.pallet_sizes.forEach(size => {
      if (pallet_size == size) {
        return size;
      }
    })
  }

  getProductAllCateogories() {
    this.inventoryService.getProductategory(this.company_id, this.product_id).subscribe(
      (res) => {
        let categories = res;
        console.log(categories);
        let categoryFormArrayControl = <FormArray>this.editProductForm.get('categories');
        for (var i = 0; i < res.length; i++) {
          console.log(this.category_array);
          for (var j = 0; j < this.category_array[i].length; j++) {
            if (categories[i].id == this.category_array[i][j].id) {
              this.onAddMoreCategory(this.category_array[i][j].children, i, categories[i].id);
            }
          }
        }
      }
    )
  }

  onSearchVrm(term) {
    this.searchService.searchVenderByName(this.company_id, term).subscribe(
      (res) => {
        this.filteredVenders = res.data;
      }
    )
  }

  ngOnChanges() {
    if (this.categories && this.categories.length > 0) {
      if (this.category_array.length == 0) {
        this.category_array.push(this.categories);
      }
    }

    if (this.editProductForm) {
      this.editProductForm.controls['as_showcase'].valueChanges.subscribe(val => {
        if (val === 0) {
          this.show_select_vender = true;
        } else {
          this.show_select_vender = false;
        }
      })
    }

  }

  getSelectedVenderInfo(vender) {
    this.venderList.pop();
    this.venderList.push(vender);
    //vender_id is the vender's id in companies table 
    this.editProductForm.patchValue({
      vender_id: vender.id
    })
    console.log(this.editProductForm.value.vender_id);
    this.getVenderAddress(vender);
  }

  getAllCategory() {
    this.inventoryService.getCategories(this.company_id, 'product').subscribe(
      (res) => {
        this.categories = res;
        if (this.categories && this.categories.length > 0 && this.category_array.length == 0) {
          this.category_array.push(this.categories);
        }
      },
      (err) => {

      },
      () => {
        this.createCompanyDefinedColumnObj();
      }
    )
  }

  // for adding new chips after input token ends
  add(event: MatChipInputEvent): void {
    setTimeout(e => {
      const input = event.input;
      const value = this.selected_vender || event.value;
      // Add our email
      // this.addHelper(value);
      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.selected_vender = '';
    }, 0);
  }

  // addHelper(value: string): void {
  //   if ((value || '').trim()) {
  //     value = value.trim().toLowerCase();
  //     if (this.validateEmail(value) && !this.emailList.includes(value)) {
  //       this.emailList.push(value);
  //     }
  //   }
  // }

  onGetRadio(item) {
    let category_id = +item.id;
    this.selected_category = item.name;
    this.editProductForm.patchValue({
      category_id: category_id
    })
  }

  onReceiveCate(obj) {
    if (obj.action == 'add') {
      this.inventoryService.addCategory(this.company_id, obj).subscribe(
        (res) => {
          this.isLoading = false;
          this.getAllCategory();
        }
      )
    } else if (obj.action == 'edit') {
      this.inventoryService.editCategory(this.company_id, obj.id, obj).subscribe(
        (res) => {
          this.isLoading = false;
          this.getAllCategory();
        }
      )
    } else if (obj.action == 'drop') {
      this.inventoryService.dropCategory(this.company_id, obj.id).subscribe(
        () => {
          this.isLoading = false;
          this.getAllCategory();
        }
      )
    }

  }

  createEditPrdocutForm() {
    this.editProductForm = this.fb.group({
      name: [''],
      headline: [''],
      description: [''],
      categories: this.fb.array([
        this.initCategory()
      ]),
      vender_id: [''],
      customer_id: [''],
      category: [''],
      category_id: [''],
      as_showcase: [''],
      images: [''],
      qty_in_20_container: [''],
      qty_in_40_container: [''],
      unit_price_type: [''],
      est_cost: [''],
      unit: ['dollars'],
      shipping_packaging_type: [""],
      pallet_size: [""],
      manufacturer_item_number: [""],
      pcs_per_case: [""],
      pcs_per_layer: [""],
      cases_per_layer: [""],
      layer_per_pallet: [""],
      cases_per_20_container: [""],
      cases_per_40_container: [""],
      pallets_per_20_container: [""],
      pallets_per_40_container: [""],
      vender_address_id: [''],
      company_defined_columns: this.fb.group(this.company_defined_columns_obj),
    });
    this.subscribeAsShowCaseBtn();
  }

  onSelectPackagingType(type) {
    this.show_packaging_type = type;
    this.editProductForm.patchValue({
      pcs_per_case: "",
      pcs_per_layer: "",
      cases_per_layer: "",
      layer_per_pallet: "",
      cases_per_20_container: "",
      cases_per_40_container: "",
      pallets_per_20_container: "",
      pallets_per_40_container: "",
    });
  }

  selectOption(event) {
    this.selected_vender = event.option.value;
  }

  initCategory() {
    return this.fb.group({
      category: ['', Validators.required]
    })
  }

  initChildrenCategory(categories) {
    return this.fb.group({
      category: []
    })
  }

  onAddMoreCategory(category, i, currentCategoryId) {
    this.onDelete(i);
    let categoryFormArrayControl = <FormArray>this.editProductForm.get('categories');
    this.editProductForm.patchValue({
      category_id: currentCategoryId
    });
    categoryFormArrayControl.at(i).patchValue(
      { category: currentCategoryId }
    )
    if (category.length > 0) {
      // this.selected.push(currentCategoryId);
      this.category_array.push(category);
      const control = <FormArray>this.editProductForm.controls['categories'];
      control.push(this.initChildrenCategory(category));
    }
  }

  onDelete(i) {
    let startIndex = i;
    let count = startIndex + 1;
    let delete_count = this.category_array.length - count;
    let delete_index_for_formarray = startIndex + 1;
    let category_control_length = (<FormArray>this.editProductForm.controls['categories']).length;
    // because formarray will update it's index, if we delete control index 1, control index 2 will become index 1;
    for (let j = category_control_length; j >= i + 1; j--) {
      const control = <FormArray>this.editProductForm.controls['categories'];
      control.removeAt(j);
    }
    this.category_array = this.category_array.splice(0, count);
  }

  createCompanyDefinedColumnObj() {
    this.inventoryService.getCompanyDefinedColumn(this.company_id, 'product').subscribe(
      (res) => {

        this.company_defined_columns = res;

        for (var i = 0; i < res.length; i++) {
          let name = res[i].column_name;
          this.company_defined_columns_obj[name] = this.getControlType(res[i]);
        }
        this.createEditPrdocutForm();
        this.getProduct();

      }
    )
  }

  remove(vender: any, type): void {
    if (type == 'vender') {
      const index = this.venderList.indexOf(vender);
      if (index >= 0) {
        this.venderList.splice(index, 1);
      }
    } else {
      const index = this.customerList.indexOf(vender);
      if (index >= 0) {
        this.customerList.splice(index, 1);
      }
    }
  }

  getControlType(company_defined_column) {
    let max = company_defined_column.max_length;
    return ['', [Validators.maxLength(max)]];
  }

  onSave() {
    console.log(this.editProductForm.valid, (this.editProductForm.value.as_showcase), this.editProductForm.value);

    if(!this.editProductForm.value.category_id){
      this.dialogService.openAlertDialog('Please provide First Layer Category!');
      return;
    }
    
    if (this.editProductForm.valid && !this.itemNumErr) {
      //上边吧image清空了 写的时候注意
      this.isLoading = true;
      this.editProductForm.patchValue({
        images: this.imgs
      })

      if (!this.editProductForm.value.category_id) {

        let obj = {
          name: this.editProductForm.value.category
        };

        this.inventoryService.addCategory(this.company_id, obj).subscribe(
          (res) => {
            this.isLoading = false;
            let category = res;
            this.editProductForm.value.category_id = +category.id;
            this.addProduct();
          }
        )

      } else {
        this.addProduct()
      }

    } else if (!this.editProductForm.value.as_showcase) {
      this.err = true;
    }
  }

  setObjAddressIds(obj) {
    if (this.editProductForm.value.vender_address_id) {
      obj['vender_address_ids'] = [this.editProductForm.value.vender_address_id];
    }
  }

  getCategoryPlaceholder(i) {
    return 'Select ' + (i + 1) + ' Layer Category';
  }

  addProduct() {
    (<HTMLButtonElement>document.getElementById('header-submit-edit')).disabled = true;
    // this.isLoading = true;
    if (this.editProductForm.value.as_showcase != 0) {
      this.editProductForm.patchValue({
        customer_id: ""
      });
    }
    let obj = JSON.parse(JSON.stringify(this.editProductForm.value));
    this.setObjAddressIds(obj);
    if (obj['unit'] == 'dollars') {
      obj['est_cost'] = obj['est_cost'] * 100000;
    }
    this.inventoryService.editProductAllInfo(this.company_id, this.product_id, obj).subscribe(
      (res) => {
        this.isLoading = false;
        this.location.back();
      }
    )
  }

  onReceiveImgs(imgs) {
    imgs = imgs.map((img) => {
      return img['id'];
    })
    this.imgs = imgs;
  }

  checkProductItemNum() {
    this.inventoryService.searchProductExist(this.company_id, 'headline', this.editProductForm.value.headline).subscribe(
      (res) => {
        if (res) {
          this.itemNumErr = 'Item # is used, Please Provide a New One!';
        } else {
          this.itemNumErr = '';
        }
      }
    )
  }


  getVenderAddress(vender) {
    this.vrmService.getVendorAddresses(this.company_id, vender.id).subscribe(
      (res) => {
        this.vender_company_addresses = res.data;
        console.log(this.vender_company_addresses);
      }
    )
  }
}
