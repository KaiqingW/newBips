import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Product } from 'app/core/models/index';

import { CommonService } from 'app/core/services/common.service';
import { ToasterService } from 'app/core/services/toaster.service';
import { InventoryService } from '../../core/services/inventory.service';
import { LeadService } from 'app/core/services/lead.service';
import { SearchService } from 'app/core/services/search.service';

@Component({
    selector: 'add-product',
    templateUrl: 'add-product.component.html',
    styleUrls: ['add-product.component.scss']
})

export class AddProductComponent implements OnInit {
    @ViewChild('personInput') personInput;
    company_id;
    customer_id;
    product_id;
    productList: Array<string> = [];
    searchList: Product[];
    searchCtrl: FormControl;
    selectedProduct;
    selectedProductId;


    // for angular material mat-chip-list and input
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;

    // separator to separate user input as chips
    separatorKeysCodes = [ENTER, COMMA];

    constructor(
        private dialog: MatDialog,
        private commonService: CommonService,
        private leadService: LeadService,
        private toasterService: ToasterService,
        private searchService: SearchService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.searchCtrl = new FormControl();
        this.searchCtrl.valueChanges.subscribe(
            (term) => {
                this.onSearch(term);
        });
        this.company_id = +this.data.company_id;
        this.customer_id = +this.data.customer_id;
    }

    ngOnInit() { }

    onSearch(value) {
        const headlineValue = 'headline='+value;
        this.searchService.searchProduct(this.company_id, headlineValue).subscribe(
            (res) => {
                this.searchList = res['data'];
                console.log(res);
                  },
            err=>{
                console.log(err);
            }
        )
        // this.commonService.searchFieldOfTable(this.company_id, 'inventory', 'product', 'name', value, 'asc').subscribe(
        //   (res) => {
        //     this.searchList = res['data'];
        //     console.log(res);
        //   },
        //   err=>{
        //       console.log(err);
        //   }
        // )
    }


    onSave() {
        this.leadService.addCustomerProduct(this.company_id, this.customer_id, this.product_id).subscribe(
            res => {
                this.toasterService.showToaster('This product add Successful!');
            },
            err => {
                this.toasterService.showToaster('This product already added!');
            }
        )
    }

    // if value is valid email and not included in the emailList, then add it to email list
    addHelper(value: string): void {
        if ((value || '').trim()) {
            value = value.trim().toLowerCase();
            if (!this.productList.includes(value)) {
                this.productList.push(value);
            }
        }
    }

    // for adding new chips after input token ends
    add(event: MatChipInputEvent): void {
        setTimeout(e => {
            const input = event.input;
            const value = this.selectedProduct || event.value;
            // Add our email
            this.addHelper(value);
            // Reset the input value
            if (input) {
                input.value = '';
            }
            this.selectedProduct = '';
        }, 0);
    }

    // remove email from emailList
    remove(product: any): void {
        const index = this.productList.indexOf(product);
        if (index >= 0) {
            this.productList.splice(index, 1);
        }
    }

    selectOption(event) {
        this.selectedProduct = event.option.value.name;
        this.product_id = event.option.value.id;

    }


}
