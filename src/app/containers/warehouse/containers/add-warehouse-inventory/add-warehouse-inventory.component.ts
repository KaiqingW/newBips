import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../core/services/inventory.service';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { WarehouseService } from '../../../../core/services/warehouse.service';

@Component({
    selector: 'add-warehouse-inventory',
    templateUrl: './add-warehouse-inventory.component.html',
    styleUrls: ['./add-warehouse-inventory.component.scss']
})

export class AddWarehouseInventoryComponent implements OnInit {
    products = [];
    company_id: number;
    isLoading: boolean = false;
    selectedProducts = [];
    countSelectedProduct = 0;

    constructor(private inventoryService: InventoryService,
        private warehouseService: WarehouseService,
        private route: ActivatedRoute,
        private router: Router) {
        this.company_id = +this.route.snapshot.paramMap.get('cid');
        
    }

    ngOnInit() {
        this.getProductList();
        this.warehouseService.clearSelectedProducts();
    }

    getProductList() {
        this.isLoading = true;
        this.inventoryService.getProductList(this.company_id).subscribe(
            res => {
                this.products = res.data;
            },
            (err) => { },
            () => {
                this.isLoading = false;
            }
        )
    }

    searchProduct(term) {
        this.isLoading = true;
        this.inventoryService.searchProductFuzzy(this.company_id, 'name', term).subscribe(
            res => {
                this.products = res.data;
            },
            (err) => { },
            () => { this.isLoading = false; }
        )
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

    addQty() {
        this.router.navigate(['qty'], { relativeTo: this.route });
    }
}