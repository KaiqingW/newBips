import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from './../../../../core/models/index';
import { Warehouse } from 'app/core/models/warehouse';

import { WarehouseService } from 'app/core/services/warehouse.service';
import { InventoryService } from './../../../../core/services/inventory.service';

@Component({
  selector: 'app-product-warehouse-detail',
  templateUrl: './warehouse-detail.component.html',
  styleUrls: ['./warehouse-detail.component.scss']
})
export class WarehouseDetailCompnent implements OnInit {
  company_id: number;
  productList: Product[];
  warehouses : Warehouse[];
  nextPagingUrl = '';
  selectedProduct: Product;

  constructor(private inventoryService: InventoryService,
              private route : ActivatedRoute,
              private warehouseService : WarehouseService,
              private router: Router) { 
                
    this.company_id = + this.route.snapshot.paramMap.get('cid');
  }

  ngOnInit() {
  }


}
