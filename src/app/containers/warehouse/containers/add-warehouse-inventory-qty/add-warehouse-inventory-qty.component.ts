import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../core/services/inventory.service';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { WarehouseService } from '../../../../core/services/warehouse.service';
import { Location } from '@angular/common';

@Component({
    selector: 'add-warehouse-inventory-qty',
    templateUrl: './add-warehouse-inventory-qty.component.html',
    styleUrls: ['./add-warehouse-inventory-qty.component.scss']
})

export class AddWarehouseInventoryQtyComponent implements OnInit {
    products = [];
    company_id: number;
    warehouse_id: number;

    isLoading: boolean = false;
    selectedProducts = [];
    countSelectedProduct = 0;

    constructor(private inventoryService: InventoryService,
        private warehouseService: WarehouseService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ) {
        this.company_id = +this.route.snapshot.paramMap.get('cid');
        this.warehouse_id = +this.route.snapshot.paramMap.get('wId');
    }

    ngOnInit() {
        this.getSelectedProduct();
    }

    getSelectedProduct() {
        this.products = this.warehouseService.getSelectedProducts();
        this.selectedProducts = this.products;
    }

    onGetSelectProduct(product) {
        let length = this.selectedProducts.length;
        let count = 0;
        for (var i = 0; i < this.selectedProducts.length; i++) {
            if (this.selectedProducts[i].id == product.id) {
                this.selectedProducts.splice(i, 1);
            } else {
                count++;
            }
        }
        if (count == length) {
            this.selectedProducts.push(product);
            this.warehouseService.setSelectedProducts(this.selectedProducts);
        }
    }

    onGetForm(productForm) {
        console.log(productForm);
        this.inventoryService.editInventories(this.company_id, this.warehouse_id, productForm).subscribe(
            (res) => {
                this.location.back();
            }
        )

    }
}