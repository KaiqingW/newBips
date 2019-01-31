import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ShopService } from '../../../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import {FormGroup, FormControl, FormBuilder, Validators, FormArray,NgForm, ReactiveFormsModule,FormGroupDirective} from "@angular/forms";
import { VrmBaBaService } from '../../../../vrm/vrm.service';
import { QuoteService } from '../../../../../core/services/quote.service';

@Component({
    selector: 'app-company-detail',
    templateUrl: 'company-detail.component.html',
    styleUrls: ['company-detail.component.scss', '../shop-order-detail.component.scss']
})

export class CompanyDetailComponent implements OnInit, OnChanges {
    @Input() company;
    @Input() shop_order_all_products;
    @Input() all_sended_products;

    warehouses;
    selectedWarehouse;
    company_id;
    invoiceForm : FormGroup;
    productForm: FormGroup;

    constructor(private shopService : ShopService,
                private route :ActivatedRoute,
                private fb : FormBuilder,
                private quoteService:QuoteService) { }

    ngOnInit() {
        this.company_id = +this.route.snapshot.paramMap.get('cid');
        if(!this.company_id){
            this.company_id = 171;
        }
    }

    ngOnChanges(){
        if(this.company){
            this.selectedWarehouse = this.company.shop_order_warehouses[0];
        }
    }

    changeWarehouse(warehouse){
        this.selectedWarehouse = warehouse;
    }

    onGetSelect(obj){
        this.shopService.updateOrderShippingStatus(this.company_id, this.selectedWarehouse.id, obj).subscribe(
            (res) => {
                // this.getOrder();
            }
        )
    }

    createInvoiceForm(){
        this.invoiceForm = this.fb.group({
            customer_id:[''],
            billing_address_id:[''],
            shipping_address_id:[''],
            type:['11'],
            shipping_method:[''],
            payment_terms:[''],
            po_number:[''],
            total:[''],
            fob:[''],
            valid_till:[''],
            due_date:[''],
            est_delivery_date:[''],
            description:[''],
            signature:[''],
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

    sendProductQty(qty, product){
        product['send-qty'] = qty;
    }

    getSendQty(product){
        let count = 0;
        this.all_sended_products.forEach(each_product => {
            if(product.id == each_product.product_id){
                count += each_product.quantity;
            }
        })
        // this.product.quantity - 
        return product.quantity - count;
    }

}