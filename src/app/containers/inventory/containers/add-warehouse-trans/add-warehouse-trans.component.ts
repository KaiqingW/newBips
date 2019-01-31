import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Product } from './../../../../core/models/index';
import { Warehouse } from 'app/core/models/warehouse';

import { InventoryService } from './../../../../core/services/inventory.service';
import { WarehouseService } from 'app/core/services/warehouse.service';

import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-product-warehouse-transaction',
  templateUrl: './add-warehouse-trans.component.html',
  styleUrls: ['./add-warehouse-trans.component.scss']
})
export class AddWarehouseTransactionComponent implements OnInit {
  company_id: number;
  warehouses : Warehouse[];
  warehouse_id : number;
  addTransForm : FormGroup;
  products;
  addTransCallBack;
  selectedWarehouse;
  product_id : number;
  next;
  product_name : string = '';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private location:Location,
    private warehouseService: WarehouseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) { 
      
    this.company_id = this.data.company_id;
    this.warehouse_id  = +this.route.snapshot.paramMap.get('wid');
    this.warehouses = this.data.warehouses;
    this.getWarehouses();
    this.product_id = this.data.product_id;
    this.product_name = this.data.product_name;
    console.log(this.product_name);
    this.createTransForm();
  }

  ngOnInit() {
  }

  getWarehouses(){
    this.warehouseService.getWarehouseCollection(this.company_id).subscribe(
        (res) => {
            this.warehouses = res.data;
            // this.setGoogleMap();

            if(res.paging.next){
              this.next = res.paging.next;
              this.getPagingWarehouses();
            } 
        }
    )
  }

  getPagingWarehouses(){
          this.warehouseService.getNextWarehouses(this.next).subscribe(
            (res) => {
              this.warehouses = this.warehouses.concat(res.data);
              this.next = res.paging.next;
            },
            (err) => {

            }
          )     
  }
  
  createTransForm(){
    this.addTransForm = this.fb.group({
      warehouse_id : [''],
      product_name: this.product_name,
      product_id: this.data.product_id,
      is_import : [''],
      amount : [''],
    })
  }

  onSave(){
    if(this.addTransForm.valid){
      this.inventoryService.addTransaction(this.company_id, this.addTransForm.value.warehouse_id, this.addTransForm.value).subscribe(
        (res) => {
          this.addTransCallBack = res;
        }
      )
    }
  }
  

}
