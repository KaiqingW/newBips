import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA , MatChipInputEvent } from '@angular/material';
import { FormGroup, FormControl, FormBuilder, Validators,FormArray } from '@angular/forms';
import { CommonService } from 'app/core/services/common.service';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service'
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { SearchService } from 'app/core/services/search.service'
@Component({
    selector: 'add-crm-opportunity',
    templateUrl:'add-crm-opportunity.component.html',
    styleUrls: ['add-crm-opportunity.component.scss']
})

export class AddCrmOpportunityComponent implements OnInit{

    opportunityForm : FormGroup;
    currentLoginCompanyId;
    customer_id;
    // customer_data;
    customer_name;
    customer_description;

    productList: Array<string> = [];
    searchCtrl: FormControl;
    selectedProduct;
    selectedProductId;
    product_id;
    searchList;
    product_item_number;
    // for angular material mat-chip-list and input
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;

    // separator to separate user input as chips
    separatorKeysCodes = [ENTER, COMMA];

    constructor(
        private fb: FormBuilder,
        private commonService : CommonService,
        private departmentOpportunityService: DepartmentOpportunityService,
        private searchService: SearchService,
        @Inject(MAT_DIALOG_DATA) public data:any
    ){
        this.createOpportunityForm();
        this.currentLoginCompanyId = +this.data.company_id;
        this.customer_id = +this.data.customer_id;
        this.customer_name = this.data.customer_data.name;
        this.customer_description = this.data.customer_data.description;

        this.searchCtrl = new FormControl();
        this.searchCtrl.valueChanges.subscribe(
          (term) => {
            this.onSearch(term);
          });



        console.log(this.currentLoginCompanyId);
        console.log(this.customer_id);
        console.log(this.customer_name);
        console.log(this.customer_description);
        console.log(this.data.customer_data);
    }

    ngOnInit(){

    }

    createOpportunityForm(){
        this.opportunityForm = this.fb.group({
            customer_name: [''],
            customer_company_id : [''],
            subject_type:['opportunity'],
            customer_description: [''],

            product_opportunity_name:[''],
            product_item_number:[''],
            product_id:[''],
            opportunity_description:[''],
            project_type:['opportunity_project']
        })
    }

    onSave(){
        this.departmentOpportunityService.addOpportunityWithCrmCustomer(this.currentLoginCompanyId, this.opportunityForm.value).subscribe(
            res=>{

            }
        )
    }

    onSearch(value){
        const headlineValue = 'headline='+value;
        this.searchService.searchProduct(this.currentLoginCompanyId, headlineValue).subscribe(
            (res) => {
                    this.searchList = res['data'];
                    console.log(res);
                  },
                  err=>{
                      console.log(err);
                  }
        )
        // this.commonService.searchFieldOfTable(this.currentLoginCompanyId, 'inventory', 'product', 'name', value, 'asc').subscribe(
        //   (res) => {
        //     this.searchList = res['data'];
        //     console.log(res);
        //   },
        //   err=>{
        //       console.log(err);
        //   }
        // )
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
        console.log(event);
        this.selectedProduct = event.option.value.name;
        this.product_id = event.option.value.id;
        this.product_item_number = event.option.value.headline;
        console.log(this.product_id);

    }


}