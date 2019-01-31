import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    Validators,
    FormArray,
    ReactiveFormsModule
} from "@angular/forms";

@Component({
    selector: "list-product-card",
    templateUrl: "./list-product-card.component.html",
    styleUrls: ["./list-product-card.component.scss"]
})


export class ListProductCardComponent implements OnInit, OnChanges {
    @Input() productList;
    @Input() selectedProducts;
    @Input() addQtyMode: boolean = false;
    @Output() sendNav = new EventEmitter<any>();
    @Output() sendNavToEdit = new EventEmitter<any>();
    @Output() sendSelect = new EventEmitter<any>();
    @Output() sendProduct = new EventEmitter<any>();

    selectedProduct;
    selectedWarehouse;
    buttonTxt = '';
    warehouse_id: number;
    productForm: FormGroup;

    constructor(private route: ActivatedRoute,
        private fb: FormBuilder) { }

    ngOnInit() {
        this.warehouse_id = + this.route.snapshot.paramMap.get('wId');
    }

    ngOnChanges() {
    }

    initProductArray(product) {
        return this.fb.group({
            // warehouse_id: [price_row.warehouse_id],
            product_id: [product.product_id],
            is_import: [true],
            amount: [],
        })
    }

    selectProduct(product) {
        this.sendProduct.emit(product);
    }

    onNavToDetail(event, id) {
        event.stopPropagation();
        this.sendNav.emit(id);
    }

    getProductInfWarehouse(product) {
        let quantity = 0;
        if (!product.warehouses && product.warehouses.length == 0) {
            return quantity;
        }
        product.warehouses.forEach(warehouse => {
            if (this.warehouse_id == warehouse.id) {
                quantity = warehouse.amount;
            }
        })
        return quantity;
    }

    onNavToEdit(id) {
        this.sendNavToEdit.emit(id);
    }

    exist(product) {
        let exist = false;
        for (var i = 0; i < this.selectedProducts.length; i++) {
            if (this.selectedProducts[i].id == product.id) exist = true;
        }
        return exist;
    }
}