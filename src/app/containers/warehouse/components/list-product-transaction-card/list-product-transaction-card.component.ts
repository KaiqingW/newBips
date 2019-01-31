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
    selector: "list-product-transaction-card",
    templateUrl: "./list-product-transaction-card.component.html",
    styleUrls: ["./list-product-transaction-card.component.scss"]
})


export class ListProductTransactionCardComponent implements OnInit, OnChanges {
    @Input() productList;
    @Input() selectedProducts;
    @Input() addQtyMode: boolean = false;
    @Output() sendNav = new EventEmitter<any>();
    @Output() sendNavToEdit = new EventEmitter<any>();
    @Output() sendSelect = new EventEmitter<any>();
    @Output() sendProduct = new EventEmitter<any>();
    @Output() sendForm = new EventEmitter<any>();

    selectedProduct;
    selectedWarehouse;
    buttonTxt = '';
    warehouse_id: number;
    productForm: FormGroup;

    constructor(private route: ActivatedRoute,
        private fb: FormBuilder) { }

    ngOnInit() {
        this.warehouse_id = + this.route.snapshot.paramMap.get('wId');
        if (this.productList && this.productList.length > 0) {
            this.createProductForm();
            setTimeout(() => {
                const buttonClick = document.getElementById("header-submit-edit");
                buttonClick.addEventListener("click", () => {
                    this.onSave();
                });
            }, 0);
        }


    }

    ngOnChanges() {
        this.createProductForm();
    }

    createProductForm() {
        this.productForm = this.fb.group({
            inventories: this.fb.array([])
        })
        this.productList.forEach(product => {
            this.onAddMore(product);
        })
    }

    initInventoriesArray(product) {
        return this.fb.group({
            product_id: [product.id],
            amount: [0],
        });
    }

    onAddMore(product) {
        // if (this.productForm.valid) {
        // let transactionArrLength = this.productForm.value.transactions.length - 1;
        // let privousValueSet = this.productForm.value.transactions[transactionArrLength];
        const control = <FormArray>this.productForm.controls['inventories'];
        control.push(this.initInventoriesArray(product));
        // }
    }

    onDelete(i) {
        if (i !== 0) {
            const control = <FormArray>this.productForm.controls['inventories'];
            control.removeAt(i);
        }
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

    onSave() {
        this.sendForm.emit(this.productForm.value);
    }
}