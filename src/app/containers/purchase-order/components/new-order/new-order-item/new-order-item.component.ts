import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule
} from "@angular/forms";
import { OrdersService } from 'app/core/services/orders.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { InventoryService } from '../../../../../core/services/inventory.service';

@Component({
  selector: 'app-new-order-item',
  templateUrl: './new-order-item.component.html',
  styleUrls: ['./new-order-item.component.scss']
})

export class NewOrderItemComponent implements OnInit, OnDestroy {

  order_item: FormGroup;
  product;
  afterConfirm: boolean = false;
  case_quantity;
  cases_per_plate;
  colors = ["FL", "AG", "CB", "AB", "CG", "EFL"];
  materials = ["GLASS", "PET", "PVC", "HTP", "LDP", "PP", "ALUMINUM", "METAL"];
  company_id: number;
  company_defined_columns = [];
  company_defined_columns_obj = {};
  itemNum;
  isLoading : boolean = false;
  description : string = '';

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private inventoryService : InventoryService
  ) {
    this.company_id = + this.route.snapshot.paramMap.get('cid');
    this.createCompanyDefinedColumnObj();
    this.createOrderItemForm();
  }


  ngOnInit() {
    setTimeout(() => {
      const buttonClick = document.getElementById("header-submit-edit");
      buttonClick.addEventListener("click", () => {
        this.onSave();
      });

      const cancelButtonClick = document.getElementById("header-cancel");
      cancelButtonClick.addEventListener("click", () => {
        this.location.back();
      });
    }, 0);

  }

  ngOnDestroy() {
    const old_element2 = document.getElementById("header-cancel");
    var new_element2 = old_element2.cloneNode(true);
    old_element2.parentNode.replaceChild(new_element2, old_element2);
  }

  createCompanyDefinedColumnObj() {
    this.ordersService.getCompanyDefinedColumn(this.company_id, 'order_item').subscribe(
      (res) => {
        this.company_defined_columns = res;

        for (var i = 0; i < res.length; i++) {
          let name = res[i].column_name;
          this.company_defined_columns_obj[name] = this.getControlType(res[i]);
        }
        this.createOrderItemForm();
      }
    )
  }

  getControlType(company_defined_column) {
    let max = company_defined_column.max_length;
    return ['', [Validators.required, Validators.maxLength(max)]];
  }

  createOrderItemForm() {
    this.order_item = this.fb.group({
      product_id: [""],
      unit_price: ["", Validators.required],
      sales_item_number: ["", Validators.required],
      quantity: ["", Validators.required],
      description: [""],
      requirement: [""],
      attachment: [""],
      case_quantity: ["", Validators.required],
      cases_per_plate: ["", Validators.required],
      shipping_method: ["", Validators.required],
      pieces_per_plate: 0,
      company_defined_columns: this.fb.group(this.company_defined_columns_obj),
      balance: 0,
      status:0
    });
  }

  onReceivedProduct(product) {
    // let product_id = +event.id;
    this.getProductDetail(product);
  }

  getProductDetail(productBrief) {
    this.isLoading = true;
    this.product = productBrief;
    this.inventoryService.getProductInfo(this.company_id, productBrief.id).subscribe(
      (res) => {
        this.isLoading = false;
        this.product = res;
        if (this.product && this.product.headline) {
          this.itemNum = this.product.headline;
          this.order_item.patchValue({
            sales_item_number: this.product.headline,
            description: this.product.description
          })
          this.description = this.product.description;
          if(this.product.company_defined_columns && this.product.company_defined_columns.case_quantity && this.product.company_defined_columns.cases_per_plate){
            this.order_item.patchValue({
              case_quantity : this.product.company_defined_columns.case_quantity,
              cases_per_plate: this.product.company_defined_columns.cases_per_plate
            })
          }
        }
      }
    )
  }

  onSave() {
    this.order_item.value.product_id = +this.product.id;
    if (this.order_item.valid) {
      this.ordersService.addLocalOrderItems(this.order_item.value);
      const old_element = document.getElementById("header-submit-edit");
      const new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
      // this.router.navigate(['../'], { relativeTo: this.route });
      this.location.back();
    }
  }
}