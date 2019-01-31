import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../../../../../core/services/inventory.service';

@Component({
  selector: 'app-price-table',
  templateUrl: './price-table.component.html',
  styleUrls: ['./price-table.component.scss']
})
export class PriceTableComponent implements OnInit {
  priceForm: FormGroup;
  @Input() retailPrices;
  product_id : number;
  @Output() sendPriceTable = new EventEmitter<any>();
  hide : boolean = false;
  constructor(private fb: FormBuilder,
              private inventoryService: InventoryService,
              private route:ActivatedRoute) { 
                this.product_id = +this.route.snapshot.paramMap.get('pid');
              }

  ngOnInit() {
    this.createPriceForm();
  }

  createPriceForm(){
    let initPriceSet = {
      max_qty : 0
    }
    this.priceForm = this.fb.group({
      prices: this.fb.array([
        this.initPriceArray(initPriceSet)
      ])
    });
  }

  initPriceArray(privousValueSet){
    return this.fb.group({
      product_id: [this.product_id],
      min_qty: [privousValueSet.max_qty + 1],
      max_qty: [''],
      price: ['']
    });
  }

  onAddMore(){
    if(this.priceForm.valid){
      let priceArrLength = this.priceForm.value.prices.length - 1;
      let privousValueSet = this.priceForm.value.prices[priceArrLength];
      const control = <FormArray>this.priceForm.controls['prices'];
      control.push(this.initPriceArray(privousValueSet));
    }
  }

  onDelete(i){
    if(i !== 0){
      const control = <FormArray>this.priceForm.controls['prices'];
      control.removeAt(i);
    }
  }

  savePriceTable(){
    let company_id = +this.route.snapshot.paramMap.get('cid');
    if(this.priceForm.valid){
      this.sendPriceTable.emit(this.priceForm.value);
      this.hide = true;
    }
  }
}
