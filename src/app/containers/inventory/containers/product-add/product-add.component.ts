import { Component, OnInit, OnChanges } from '@angular/core';
import { Product } from './../../../../core/models/index';
import { Warehouse } from 'app/core/models/warehouse';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { InventoryService } from '../../../../core/services/inventory.service';
import { VrmBaBaService } from '../../../vrm/vrm.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material'
import { Observable } from 'rxjs/Observable';
import { SearchService } from '../../../../core/services/search.service';
import { CompanyService } from '../../../../core/services/company.service';
import { CopyService } from '../../../../core/services/copy.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { Subscription } from 'rxjs';
import { LeadService } from '../../../../core/services/lead.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})

export class ProductAddComponent implements OnInit, OnChanges {
  addProductForm: FormGroup;
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
  customerList = [];
  separatorKeysCodes = [ENTER, COMMA];
  vender: Array<string> = [];
  selected_vender;
  selected_customer;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  filteredVenders;
  filteredCustomers;
  venderCtrl: FormControl = new FormControl();
  customerCtrl: FormControl = new FormControl();
  vender_company_addresses;
  copy_product_info;
  radioSub: Subscription;
  showCustomerInput: boolean = false;
  customerIdErr: boolean = false;
  shipping_packaging_type = ["Bulk Pack", "Case Pack On Pallets", "Case Pack Floor Load"];
  show_packaging_type = "";
  pallet_sizes = ["40 * 48 Inch", "48 * 58 Inch"];

  // for opportunity, editted by yali
  crmOpportunityProjectId = "";

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private location: Location,
    private companyService: CompanyService,
    private searchService: SearchService,
    private vrmService: VrmBaBaService,
    private copyService: CopyService,
    private dialogService: DialogService,
    private leadService: LeadService) {

    this.company_id = +this.route.snapshot.paramMap.get('cid');
    this.getAllCategory();
    this.createCompanyDefinedColumnObj();
    this.subscribeTermSearch();

    this.copy_product_info = this.copyService.getSelectedProduct();
    if (this.copy_product_info) {
      this.dialogService.openCustomizedSureDialog('Do you want to paste information to this product?').subscribe(
        res => {
          if (res) {
            // this.isLoading = true;
            this.setProductInfo(this.copy_product_info);
          }
        }
      )
    }

    // for opportunity, editted by yali    
    // this.crmOpportunityProjectId = this.route.snapshot.queryParams['crmOpportunityProjectId'] ? this.route.snapshot.queryParams['crmOpportunityProjectId'] : "";
  }

  ngOnInit() {
    setTimeout(() => {
      const buttonClick = document.getElementById("header-submit-edit");
      buttonClick.addEventListener("click", () => {
        this.onSave();
      });
    }, 0);
  }

  onSelectPackagingType(type) {
    this.show_packaging_type = type;
    this.addProductForm.patchValue({
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

  setProductInfo(product_info) {
    this.addProductForm.patchValue({
      name: product_info.name,
      headline: product_info.headline,
      description: product_info.description,
      // categories: this.fb.array([
      //   this.initCategory()
      // ]),
      shipping_packaging_type: product_info.product_info,
      pallet_size: product_info.pallet_size,
      pcs_per_case: product_info.pcs_per_case,
      pcs_per_layer: product_info.pcs_per_layer,
      cases_per_layer: product_info.cases_per_layer,
      layer_per_pallet: product_info.layer_per_pallet,
      cases_per_20_container: product_info.cases_per_20_container,
      cases_per_40_container: product_info.cases_per_40_container,
      pallets_per_20_container: product_info.pallets_per_20_container,
      pallets_per_40_container: product_info.pallets_per_40_container,
      vender_id: product_info.vender_id,
      category: "",
      category_id: "",
      as_showcase: product_info.as_showcase,
      images: [],
      qty_in_20_container: product_info.qty_in_20_container,
      qty_in_40_container: product_info.qty_in_40_container,
      unit_price_type: product_info.unit_price_type,
      est_cost: product_info.est_cost / 100000,
      unit: 'dollars',
      manufacturer_item_number: product_info.manufacturer_item_number,
      vender_address_id: product_info.vender_address_id,
      // company_defined_columns: this.fb.group(this.company_defined_columns_obj),
    })
    // console.log(this.conto)
    product_info.company_defined_columns.forEach(define_column => {
      if (define_column.value != 'NULL') {
        (<FormGroup>this.addProductForm.controls['company_defined_columns']).controls[define_column.name].patchValue(define_column.value);
      }
    })
  }

  onSearchVrm(term) {
    this.searchService.searchVenderByName(this.company_id, term).subscribe(
      (res) => {
        this.filteredVenders = res.data;
      }
    )

  }

  onSearchCrm(term) {
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

  ngOnChanges() {
    if (this.categories && this.categories.length > 0) {
      if (this.category_array.length == 0) {
        this.category_array.push(this.categories);
      }
    }
  }

  getSelectedVenderInfo(vender) {
    this.venderList.pop();
    this.venderList.push(vender);
    //vender_id is the vender's id in companies table 
    this.addProductForm.patchValue({
      vender_id: vender.id
    })
    // this.getVenderAddress(vender);
  }

  getSelectedCustomerInfo(customer) {
    this.customerList.pop();
    this.customerList.push(customer);
    //vender_id is the vender's id in companies table 
    this.addProductForm.patchValue({
      customer_id: customer.id
    })
    this.customerIdErr = false;
  }

  getAllCategory() {
    this.inventoryService.getCategories(this.company_id, 'product').subscribe(
      (res) => {
        this.categories = res;
        console.log(this.category_array);

        if (this.categories && this.categories.length > 0 && this.category_array.length == 0) {
          this.category_array.push(this.categories);
        }
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

  onGetRadio(item) {
    let category_id = +item.id;
    this.selected_category = item.name;
    this.addProductForm.patchValue({
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

  createAddPrdocutForm() {
    this.addProductForm = this.fb.group({
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
      as_showcase: ['3'],
      images: [''],
      qty_in_20_container: [''],
      qty_in_40_container: [''],
      unit_price_type: [''],
      est_cost: [''],
      unit: ['dollars'],
      manufacturer_item_number: [""],
      vender_address_id: [''],
      shipping_packaging_type: [''],
      pallet_size: [''],
      pcs_per_case: [''],
      pcs_per_layer: [''],
      cases_per_layer: [''],
      layer_per_pallet: [''],
      cases_per_20_container: [''],
      cases_per_40_container: [''],
      pallets_per_20_container: [''],
      pallets_per_40_container: [''],

      company_defined_columns: this.fb.group(this.company_defined_columns_obj),
    });

    this.subscribeAsShowCaseBtn();
  }

  subscribeAsShowCaseBtn() {
    this.addProductForm.controls['as_showcase'].valueChanges.subscribe(
      val => {
        if (val == 0) {
          this.showCustomerInput = true;
        } else {
          this.addProductForm.patchValue({
            customer_id: ""
          });
          this.showCustomerInput = false;
        }
      }
    )
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

  onAddMoreCategory(category, i) {
    this.onDelete(i);
    let categoryFormArrayControl = <FormArray>this.addProductForm.get('categories');
    this.addProductForm.patchValue({
      category_id: categoryFormArrayControl.at(i).value.category
    });
    if (category.length > 0) {
      this.category_array.push(category);
      const control = <FormArray>this.addProductForm.controls['categories'];
      control.push(this.initChildrenCategory(category));
    }
  }

  onDelete(i) {
    let startIndex = i;
    let count = startIndex + 1;
    let delete_count = this.category_array.length - count;
    let delete_index_for_formarray = startIndex + 1;
    let category_control_length = (<FormArray>this.addProductForm.controls['categories']).length;
    // because formarray will update it's index, if we delete control index 1, control index 2 will become index 1;
    for (let j = category_control_length; j >= i + 1; j--) {
      const control = <FormArray>this.addProductForm.controls['categories'];
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
        this.createAddPrdocutForm();
        // this.addProductForm.controls['as_showcase'].valueChanges.subscribe(val => {
        //   if (val === "0") {
        //     this.show_select_vender = true;
        //   } else {
        //     this.show_select_vender = false;
        //   }
        // })
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
    console.log(this.addProductForm.valid, (this.addProductForm.value.as_showcase), this.addProductForm.value);
    if (!this.addProductForm.value.category_id) {
      this.dialogService.openAlertDialog('Please provide First Layer Category!');
      return;
    }
    if ((this.checkIfVenderProvided()) && this.addProductForm.valid && !this.itemNumErr) {
      //上边吧image清空了 写的时候注意
      this.isLoading = true;
      this.addProduct();

    } else if (!this.addProductForm.value.as_showcase) {
      this.err = true;
    }
  }

  checkIfVenderProvided() {
    if (this.addProductForm.value.as_showcase == 1 || this.addProductForm.value.as_showcase == 3) return true;
    if (this.addProductForm.value.as_showcase == "0" && this.addProductForm.value.customer_id) {
      return true;
    }
    this.customerIdErr = true;
    console.log(this.customerIdErr);

    return false;
  }

  setObjAddressIds(obj) {
    if (this.addProductForm.value.vender_address_id) {
      obj['vender_address_ids'] = [this.addProductForm.value.vender_address_id];
    }
  }

  getCategoryPlaceholder(i) {
    return 'Select ' + (i + 1) + ' Layer Category';
  }

  addProduct() {
    console.log(this.addProductForm.value, this.addProductForm.valid);
    (<HTMLButtonElement>document.getElementById('header-submit-edit')).disabled = true;
    // this.isLoading = true;
    console.log('before', this.addProductForm.value);

    this.addProductForm.value.images = this.imgs;

    console.log(this.addProductForm.value);
    let obj = JSON.parse(JSON.stringify(this.addProductForm.value));
    this.setObjAddressIds(obj);
    if (obj['unit'] == 'dollars') {
      obj['est_cost'] = obj['est_cost'] * 100000;
    }

    // for opportunity, editted by yali
    obj['crm_opportunity_project_id'] = this.crmOpportunityProjectId;

    this.inventoryService.addProduct(this.company_id, obj).subscribe(
      (res) => {
        this.isLoading = false;

        this.copyService.setSelectedProduct('');
        this.router.navigate([`/company/${this.company_id}/inventory/product`]);
      },
      (err) => {
        this.isLoading = false;
        if (err.error && err.error.message == 'Item number is existed. Please provide a new one.') {
          this.dialogService.openAlertDialog(err.error.message);
        }
        (<HTMLButtonElement>document.getElementById('header-submit-edit')).disabled = false;
      },
      () => {
      }
    )
  }

  onGetCategory(category_id) {

  }

  onReceiveImgs(imgs) {
    imgs = imgs.map((img) => {
      return img['id'];
    })
    this.imgs = imgs;
  }

  checkProductItemNum() {
    this.inventoryService.searchProductExist(this.company_id, 'headline', this.addProductForm.value.headline).subscribe(
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
  saveItem() {
    this.router.navigate([`/company/`]);
  }

}
