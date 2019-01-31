import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdersService } from 'app/core/services/orders.service';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { Location } from '@angular/common';


@Component({
    selector: 'app-order-edit-order-status',
    templateUrl : './edit-order-status.component.html',
    styleUrls : ['./edit-order-status.component.scss']
})

export class EditOrderStatusComponent implements OnInit {
    company_id : number;
    order_id : number;
    item_id : number;
    isLoading : boolean = false;
    item;
    currentBalance: number;
    company_defined_columns = [];
    order_item : FormGroup;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private ordersService : OrdersService,
                private fb: FormBuilder,
                private location: Location) {

        this.company_id =+ this.route.snapshot.paramMap.get('cid');
        this.order_id =+ this.route.snapshot.paramMap.get('oId');
        this.item_id =+ this.route.snapshot.paramMap.get('iId');
        
        this.getOrderItem(this.company_id);
        this.createForm();
    }

    ngOnInit() {

      setTimeout(() => {
        const buttonClick = document.getElementById("header-submit-edit");
        buttonClick.addEventListener("click", ($event) => {
          this.onSave();
          console.log('save');
          $event.preventDefault();
        });
      }, 0);
      
    }

    getOrderItem(companyId) {
        this.isLoading = true;
        this.ordersService.getOrderItem(companyId, this.item_id).subscribe(
          (res) => {
            this.isLoading = false;
            this.item = res;
            console.log(this.item);
            this.ordersService.setPdId(this.item.product.id);
            this.currentBalance = +this.item.balance;
           
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
            this.order_item.patchValue({
              product_id: this.item.product.id,
              unit_price: this.item.unit_price,
              sales_item_number: this.item.sales_item_number,
              quantity: this.item.quantity,
              description: this.item.description,
              requirement: this.item.requirement,
              case_quantity: this.item.case_quantity,
              cases_per_plate: this.item.cases_per_plate,
              shipping_method: this.item.shipping_method,
              pieces_per_plate: this.calculatePiecesPerPlate(),
            });
          },
          (err) => {
          }
        )
      }

      createForm() {
        // this.editOrderStatusForm = this.fb.group({
        //     // product_id: [this.item.product.id],
        //     unit_price: [this.item.unit_price, Validators.required],
        //     sales_item_number: [this.item.sales_item_number, Validators.required],
        //     quantity: [this.item.quantity, Validators.required],
        //     // description: [this.item.description],
        //     requirement: [this.item.requirement],
        //     case_quantity: [this.item.case_quantity, Validators.required],
        //     cases_per_plate: [this.item.cases_per_plate, Validators.required],
        //     shipping_method: [this.item.shipping_method, Validators.required],
        //     pieces_per_plate: this.calculatePiecesPerPlate(),
        //     // company_defined_columns: this.fb.group(this.company_defined_columns_obj),
        //   });
          // this.order_item = this.fb.group({
          //   product_id: [this.item.product.id],
          //   unit_price: [this.item.unit_price, Validators.required],
          //   sales_item_number: [this.item.sales_item_number, Validators.required],
          //   quantity: [this.item.quantity, Validators.required],
          //   description: [this.item.description],
          //   requirement: [this.item.requirement],
          //   case_quantity: [this.item.case_quantity, Validators.required],
          //   cases_per_plate: [this.item.cases_per_plate, Validators.required],
          //   shipping_method: [this.item.shipping_method, Validators.required],
          //   pieces_per_plate: this.calculatePiecesPerPlate(),
          //   balance: 0,
          // });
            this.order_item = this.fb.group({
              product_id: [""],
              unit_price: ["", Validators.required],
              sales_item_number: ["", Validators.required],
              quantity: ["", Validators.required],
              description: [""],
              requirement: [""],
              case_quantity: ["", Validators.required],
              cases_per_plate: ["", Validators.required],
              shipping_method: ["", Validators.required],
              pieces_per_plate: 0,
            });
          
      }
   
      calculatePiecesPerPlate(){
            if(this.order_item.value.case_quantity && this.order_item.value.cases_per_plate){
              console.log(this.order_item.value.case_quantity * this.order_item.value.cases_per_plate);
                return this.order_item.value.case_quantity * this.order_item.value.cases_per_plate;
            }
      }

      onSave(){
        console.log('!',this.order_item.value);
          if(this.order_item.valid){
            console.log(this.order_item.value);
            this.isLoading = true;
            this.ordersService.updateOrderItem(this.company_id, this.item_id, this.order_item.value).subscribe(
              res => {
                this.isLoading = false;
                this.location.back();
              }
            )
          }
      }
}