import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    Validators,
    FormArray,
    ReactiveFormsModule
} from "@angular/forms";
@Component({
    selector: 'inventory-wholesale-price',
    templateUrl: 'wholesale-price.component.html',
    styleUrls: ['./wholesale-price.component.scss']
})


export class WholesalePriceComponent implements OnInit, OnChanges {
    @Input() product;
    @Output() sendProduct = new EventEmitter<any>();
    percentage;
    margin_percentage;
    wholesaleForm: FormGroup;
    editMode = false;
    readonly unit: number = 100000;
    constructor(private fb: FormBuilder) { }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.product) {
            this.createForm();
        }
    }

    changeMode() {
        this.editMode = !this.editMode;
    }

    createForm() {
        this.wholesaleForm = this.fb.group({
            est_cost: [this.product.est_cost / this.unit],
            est_sale_price: [this.product.est_sale_price / this.unit],
            markup: [(this.product.est_sale_price - this.product.est_cost) / this.product.est_cost * 100],
            margin: [(this.product.est_sale_price - this.product.est_cost) / this.product.est_sale_price * 100]
        })
    }

    onKeyUp(event) {
        let input_id = event.target.id;
        let value = event.target.value;
        if (value <= 0) return;
        let est_cost = this.wholesaleForm.value.est_cost;
        let est_sale_price = this.wholesaleForm.value.est_sale_price;
        let markup = this.wholesaleForm.value.markup;
        let margin = this.wholesaleForm.value.margin;

        switch (input_id) {
            case 'est_cost':
                est_cost = value;
                if (est_sale_price && est_sale_price >= est_cost) {
                    markup = (est_sale_price - est_cost) / est_cost * 100;
                    margin = (est_sale_price - est_cost) / est_sale_price * 100;
                } else if (markup) {
                    est_sale_price = markup / 100 * est_cost + est_cost;
                    margin = (est_sale_price - est_cost) / est_sale_price * 100;
                } else if (margin) {
                    est_sale_price = est_cost / (1 - margin / 100);
                    markup = (est_sale_price - est_cost) / est_cost * 100;
                }
                break;

            case 'est_sale_price':
                est_sale_price = value;
                if (est_cost) {
                    markup = (est_sale_price - est_cost) / est_cost * 100;
                    margin = (est_sale_price - est_cost) / est_sale_price * 100;
                } else if (markup && !est_cost) {
                    est_cost = (est_sale_price / (markup / 100 - 1));
                    margin = (est_sale_price - est_cost) / est_sale_price * 100;
                } else if (margin && !est_cost) {
                    est_cost = est_sale_price - est_sale_price * margin / 100;
                    markup = (est_sale_price - est_cost) / est_cost * 100;
                } 
                break;

            case 'markup':
                markup = value;
                if (est_cost) {
                    est_sale_price = markup / 100 * est_cost + est_cost;
                    margin = (est_sale_price - est_cost) / est_sale_price * 100;
                } else if (est_sale_price && !est_cost) {
                    est_cost = (est_sale_price / (markup / 100 - 1));
                    margin = (est_sale_price - est_cost) / est_sale_price * 100;
                }
                break;

            case 'margin':
                margin = value;
                if (est_cost) {
                    est_sale_price = est_cost / (1 - margin / 100);
                    markup = (est_sale_price - est_cost) / est_cost * 100;
                } else if (est_sale_price && !est_cost) {
                    est_cost = (est_sale_price / (markup / 100 - 1));
                    margin = (est_sale_price - est_cost) / est_sale_price * 100;
                }
                break;
        }

        this.wholesaleForm.patchValue({
            // est_cost: Number.parseFloat(est_cost).toPrecision(3),
            // est_sale_price: Number.parseFloat(est_sale_price).toPrecision(3),
            // markup: Number.parseFloat(markup).toPrecision(3),
            // margin: Number.parseFloat(margin).toPrecision(3)
            est_cost: est_cost,
            est_sale_price: est_sale_price,
            markup: markup,
            margin: margin
        });
    }

    getSalePrice(est_cost, markup, margin) {
        if (est_cost && markup) {
            return (1 + (markup / 100)) * est_cost;
        } else if (est_cost && margin) {
            return est_cost * (1 - margin / 100);
        }
    }

    getMarkup(est_cost, est_sale_price, margin) {
        if (est_cost && est_sale_price) {
            return (est_sale_price - est_cost) / est_cost * 100;
        } else if (est_cost && margin) {

        }
    }

    getMargin(est_cost, est_sale_price, margin) {

    }

    onSave() {
        this.changeMode();
        this.wholesaleForm.value.est_cost = this.wholesaleForm.value.est_cost * this.unit;
        this.wholesaleForm.value.est_sale_price = this.wholesaleForm.value.est_sale_price * this.unit;
        this.sendProduct.emit(this.wholesaleForm.value);
    }
}