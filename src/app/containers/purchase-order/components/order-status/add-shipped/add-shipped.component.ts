import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { ShippingInfoService } from 'app/core/services/shippingInfo.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { OrdersService } from 'app/core/services/orders.service';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-add-shipped',
  templateUrl: './add-shipped.component.html',
  styleUrls: ['./add-shipped.component.scss']
})

export class AddShippedComponent implements OnInit {
  
  item;
  shipForm: FormGroup;
  company_id : number;
  order_item_id : number;
  currentBalance: number;
  typingQuantity;
  vassel_date;
  newShippingInfoCallBack;

  constructor(private fb: FormBuilder, 
              private shippingInfoService: ShippingInfoService,
              private route: ActivatedRoute,
              private location: Location,
              private ordersService: OrdersService,
              @Inject(MAT_DIALOG_DATA) public data: any) {

              this.company_id = + this.data.company_id;
              this.order_item_id = + this.data.order_item_id;
              this.getOrderItem();
              this.createForm();
  }

  ngOnInit() {
  
  }


  createForm() {
    this.shipForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.max(this.currentBalance)]],
      actual_quantity:[0],
      container_number: [''],
      vessel_date: [''],
      eta_date: [''],
      actual_arrive_date: [''],
      glk_number: [''],
      status:[''],
      type: []
    });
    this.shipForm.patchValue(
      {
        status: 'shipping',
        type: 1
    });
  }

  getOrderItem() {
    this.ordersService.getOrderItem(this.company_id, this.order_item_id).subscribe(
        (res) => {
            this.item = res;
            this.currentBalance = this.item.balance;
        },
        (err) => {
          
        }
    )
  }

  onSave(){
    if(this.shipForm.valid && this.currentBalance){
      // if(this.shipForm.value.quantity <= this.currentBalance){
        this.shippingInfoService.addShippingInfo(this.company_id, this.order_item_id, this.shipForm.value).subscribe(
          (res) => {
            this.newShippingInfoCallBack = res;
          },
          (err) => {
          }
        );
      // }   
    }
   
  }
}
