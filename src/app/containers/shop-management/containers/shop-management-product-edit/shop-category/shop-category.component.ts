import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
    selector: 'app-shop-category',
    templateUrl: './shop-category.component.html',
    styleUrls: ['./shop-category.component.scss']
})

export class ShopCateogryComponent implements OnInit {
    @Input() categories;
    @Input() productCategories;
    @Input() firstCate;
    @Input() secondCate;
    @Input() thirdCate;
    @Input() unit_weight;
    @Output() sendData = new EventEmitter<any>();
    categoryForm: FormGroup;
    units = ['oz', 'lb'];
    constructor(private fb : FormBuilder) { }

    ngOnInit() {
         this.createCateogryForm();
         this.categoryForm.get('first_category').valueChanges.subscribe(val => {
            this.categoryForm.patchValue({
                second_category : this.categoryForm.value.first_category,
                third_category : ""
            });
            console.log(this.categoryForm.value);
        });
        this.categoryForm.get('second_category').valueChanges.subscribe(val => {
            this.categoryForm.patchValue({
                third_category : this.categoryForm.get('second_category')
            });
        });
    }

    createCateogryForm(){
        this.categoryForm = this.fb.group({
            unit_weight : [''],
            unit:[''],
            first_category: [''],
            second_category: [''],
            third_category: ['']
        })
    }

    onSave(){
        if(this.categoryForm.valid){
            let obj = this.categoryForm.value;
            for(var prop in obj){
                if(obj[prop] && prop != 'unit_weight' && prop != 'unit'){
                    obj[prop] = obj[prop].name;
                }
                if(prop == 'unit_weight'){
                    obj[prop] = obj['unit_weight'] + ' ' + obj['unit'];
                }
            }
            console.log(obj);
            this.sendData.emit(obj);
        }
    }


}
