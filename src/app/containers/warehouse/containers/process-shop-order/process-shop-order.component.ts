import { Component } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray,NgForm, ReactiveFormsModule,FormGroupDirective} from "@angular/forms";

@Component({
    selector: 'process-shop-order',
    templateUrl: './process-shop-order.component.html',
    styleUrls: ['./process-shop-order.component.scss']
})

export class ProcessShopOrderComponent {
    invoiceForm : FormGroup;
    productForm: FormGroup;
    constructor(private fb : FormBuilder) {
    }


    createQuoteForm(){
        this.invoiceForm = this.fb.group({
            customer_id:[''],
            billing_address_id:[''],
            shipping_address_id:[''],
            type:['11'],
            shipping_method:[''],
            total:[''],
            description:[''],
            approve_status:[''],
            customer_number:[''],
            ref_number:[''],
            shipping_terms:['1234'],
            o_code:[''],
            self_number:[''],
            customer_name:[''],
            total_value:[''],
            note_subject:Object,

            products: this.fb.array([

            ])
        })
    }


    createProductForm(){
        this.productForm = this.fb.group({
           product_id:[''],
           name:[''],
           quantity:[''],
           warehouse_name:[''],
           description:[''],
           rate:[''],
           img_url:[''],
           original_rate:[''],
           approved: ['']

       })
    }
}
