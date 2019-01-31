import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ImageService } from 'app/core/services/image.service';
import { InventoryService } from 'app/core/services/inventory.service';
import { CommonService } from 'app/core/services/common.service';
import { CostAnalysisService } from 'app/core/services/cost-analysis.service';


@Component({
    selector:'add-costanalysis',
    templateUrl:'add-costanalysis.component.html',
    styleUrls:['add-costanalysis.component.scss']
})

export class AddCostAnalysisComponent implements OnInit{
    costAnalysisForm: FormGroup;
    itemForm : FormGroup;
    itemCtrl : FormControl;
    currentLoginCompanyId;
    isLoading:boolean;
    showAddProductModal:boolean = false;
    itemList = [];
    searchItemList;
    selectedItem;
    cost_analysis_defined_columns =[];
    cost_analysis_defined_columns_obj = {};
    imgs = [];
    customizedFieldName;
    
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private imageService : ImageService,
        private inventoryService : InventoryService,
        private commonService:CommonService,
        private costAnalysisService: CostAnalysisService
    ){
        this.isLoading= true;
        this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
        this.createRequestInfoDefinedColumnObj();
    }

    ngOnInit(){
        this.getCostAnalysisCustomizedInfo();
        setTimeout(() => {
            const buttonClick = document.getElementById("header-submit-edit");
            buttonClick.addEventListener("click", () => {
                
              this.onSave();
            });
          }, 0);
    }

    getCostAnalysisCustomizedInfo(){
        this.costAnalysisService.getCostAnalysisCustomizedFiled(this.currentLoginCompanyId, 'cost_analysis').subscribe(
            res=>{
                this.customizedFieldName = res;
                this.sortObjectArray(this.customizedFieldName);
                this.isLoading = false;
            }
        )
    }

    createCostAnalysisForm(){
        this.costAnalysisForm = this.fb.group({
            product_name:[''],
            description:[''],
            exchange_rate:[''],
            material: [''],
            size:[''],
            pieces_case:[''],
            case_pallet:[''],
            pallet_container:[''],
            total:[],
            items:this.fb.array([

            ]),
            request_defined_columns:this.fb.group(this.cost_analysis_defined_columns_obj)
        })
    }

    createItemFrom(){
        this.itemForm = this.fb.group({
            product_id: [''],
            quantity:[''],
            name:[''],
            rate: [''],
            description:['']
    })
    }

/*----------------------open add product modal------------------------------*/
    addProductModal(){
        this.createItemFrom();
        this.showAddProductModal = true;
        // this.selectedProduct =null;
        this.itemCtrl = new FormControl();
        
        this.itemCtrl.valueChanges.subscribe(
            (term)=> {
                console.log(term);
                this.onSearchItem(term);
            }
        )
    }

    cancelAddProduct(){
        this.showAddProductModal = false;
    }

    addItem(value){
        this.itemList.push(value);
        this.showAddProductModal = false;
        console.log(this.itemList);
    }

    onSearchItem(value){
        this.commonService.searchFieldOfTable(this.currentLoginCompanyId, 'inventory', 'product', 'name', value, 'desc').subscribe(
            (res) => {
              this.searchItemList = res['data'];
              console.log(res['data']);
            }
        )
    }
    itemSlected(value){
        this.selectedItem = value;
    }
//get customlized defined column name
    createRequestInfoDefinedColumnObj(){
        this.costAnalysisService.getCostAnalysisCustomizedFiled(this.currentLoginCompanyId, 'cost_analysis').subscribe(
            res=>{
                console.log(res);
                this.cost_analysis_defined_columns = res;
                console.log(res);
                for (var i = 0; i<res.length; i++){
                    let name = res[i].column_name;
                    this.cost_analysis_defined_columns_obj[name] = this.getControlType(res[i]);
                }
                this.createCostAnalysisForm();
            }
        )
    }

    getControlType(company_defined_column) {
        let max = company_defined_column.max_length;
        return [''];
    }

    sortObjectArray(array) {
        // sort customizedFieldName according to the order
        function compare (a, b) {
            if (a.sort_order < b.sort_order) {
            return -1;
            }
            if (a.sort_order > b.sort_order) {
            return 1;
            }
            return 0;
        }
        array.sort(compare);
    }

    onSave(){
        console.log('123');
        let newCostAnalysis = this.costAnalysisForm.value;
        newCostAnalysis.items = this.itemList;
        console.log('12');
        this.costAnalysisService.addCostAnalysis(this.currentLoginCompanyId, this.costAnalysisForm.value).subscribe(
            res=>{
                console.log(res);
                this.isLoading = false;
            }
        )
    }
}