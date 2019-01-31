import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../../../../../core/services/inventory.service';
import { Warehouse } from '../../../../../core/models';
import { WarehouseService } from '../../../../../core/services/warehouse.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-add-wholesale-price-table',
  templateUrl: './add-wholesale-price-table.component.html',
  styleUrls: ['./add-wholesale-price-table.component.scss']
})
export class AddWholesalePriceTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() wholesalePrices;
  @Input() warehouse_id: number;
  @Output() sendPriceTable = new EventEmitter<any>();
  priceForm: FormGroup;
  hide: boolean = false;
  product_id: number;
  warehouses;
  company_id: number;
  units = ['case', 'pallet'];

  constructor(private fb: FormBuilder,
    private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private warehouseService: WarehouseService
  ) {
    this.product_id = +this.route.snapshot.paramMap.get('pid');
    this.company_id = +this.route.snapshot.paramMap.get('cid');
    this.wholesalePrices
    this.getWarehouses();
  }

  ngOnInit() {
    if (this.wholesalePrices && this.wholesalePrices.length > 0) {
      this.createEditPriceForm();
    } else {
      this.createPriceForm();
    }
  }

  ngOnChanges() {

  }

  ngOnDestroy(){
  }

  createPriceForm() {
    let initPriceSet = {
      max_qty: 0
    }
    this.priceForm = this.fb.group({
      unit: ["pcs"],
      warehouse_id: [this.warehouse_id],
      prices: this.fb.array([
        this.initPriceArray(initPriceSet)
      ])
    });
  }

  createEditPriceForm() {
    this.priceForm = this.fb.group({
      warehouse_id: [""],
      unit: ["pcs"],
      prices: this.fb.array([])
    })
    const control = <FormArray>this.priceForm.controls['prices'];

    this.wholesalePrices.foreach(price_row => {
      this.initEditPriceArray(price_row);
    })
  }

  initEditPriceArray(price_row) {
    return this.fb.group({
      // warehouse_id: [price_row.warehouse_id],
      product_id: [price_row.product_id],
      min_qty: [price_row.min_qty],
      max_qty: [price_row.max_qty],
      price: [price_row.price],
    })
  }

  initPriceArray(privousValueSet) {
    return this.fb.group({
      // warehouse_id: [this.warehouse_id],
      product_id: [this.product_id],
      min_qty: [privousValueSet.max_qty + 1],
      max_qty: [''],
      price: ['']
    });
  }

  onAddMore() {
    if (this.priceForm.valid) {
      let priceArrLength = this.priceForm.value.prices.length - 1;
      let privousValueSet = this.priceForm.value.prices[priceArrLength];
      const control = <FormArray>this.priceForm.controls['prices'];
      control.push(this.initPriceArray(privousValueSet));
    }
  }

  onDelete(i) {
    if (i !== 0) {
      const control = <FormArray>this.priceForm.controls['prices'];
      control.removeAt(i);
    }
  }

  savePriceTable() {
    let company_id = +this.route.snapshot.paramMap.get('cid');
    if (this.priceForm.valid) {
      this.sendPriceTable.emit(this.priceForm.value);
      this.hide = true;
    }
  }

  getWarehouses() {
    this.warehouseService.getWarehouseCollectionNoPaging(this.company_id).subscribe(
      res => {
        this.warehouses = res
      }
    )
  }

  cancel(){
    this.inventoryService.wholesalePriceMode.next('');
  }
}
