import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/models/index';
import { Warehouse } from 'app/core/models/warehouse';
import { Router, ActivatedRoute } from '@angular/router';
import { Location  } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { InventoryService } from '../../../core/services/inventory.service';


@Component({
  selector: 'showcase-add',
  templateUrl: './showcase-add.component.html',
  styleUrls: ['./showcase-add.component.scss']
})
export class ShowcaseAddComponent implements OnInit {
  addProductForm : FormGroup;
  company_id: number;
  company_defined_columns = [];
  company_defined_columns_obj = {};
  imgs = [];
  isLoading : boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private inventoryService: InventoryService,
              private location: Location) {
                
              this.company_id = +this.route.snapshot.paramMap.get('cid');
              this.createCompanyDefinedColumnObj();

  }

  ngOnInit() {
    setTimeout(() => {
      const buttonClick = document.getElementById("header-submit-edit");
      buttonClick.addEventListener("click", () => {
        this.onSave();  
      });
    }, 0);
  }

  createAddPrdocutForm(){
    this.addProductForm = this.fb.group({
      name: [''],
      headline: [''],
      description: [''],
      category: [''],
      as_showcase: ['yes'],
      images: [''],
      company_defined_columns:this.fb.group(this.company_defined_columns_obj),
    });

  }

  createCompanyDefinedColumnObj(){
    this.inventoryService.getCompanyDefinedColumn(this.company_id, 'product').subscribe(
      (res) => {

        this.company_defined_columns = res;
        
        for(var i = 0; i < res.length; i++){
          let name = res[i].column_name;
          this.company_defined_columns_obj[name] = this.getControlType(res[i]);
        }
        
        this.createAddPrdocutForm();
      }
    )
  }

  getControlType(company_defined_column){
    let max = company_defined_column.max_length;
    return [ '' ,[Validators.required, Validators.maxLength(max)]];
  }

  onSave(){
    if(this.addProductForm.valid){
      console.log(this.addProductForm.value)
      this.isLoading = true;
      this.addProductForm.value.images = this.imgs;
      this.inventoryService.addProduct(this.company_id, this.addProductForm.value).subscribe(
        (res) => {
          this.isLoading = false;
          this.location.back();
        }
      )
    }
  }

  onReceiveImgs(imgs){
    imgs = imgs.map((img) => {
      return img['id'];
    })
    this.imgs = imgs;
    console.log('!!',this.addProductForm.value.images);
  }
}
