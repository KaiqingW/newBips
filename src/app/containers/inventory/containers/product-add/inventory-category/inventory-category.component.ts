import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    Validators,
    FormArray,
    ReactiveFormsModule
} from "@angular/forms";

@Component({
    selector: 'inventory-cateogry',
    templateUrl: './inventory-category.component.html',
    styleUrls: ['./inventory-category.component.scss', '../product-add.component.scss']
})

export class InventoryCategoryComponent implements OnInit, OnChanges {
    @Input() categories;
    @Output() sendCategory = new EventEmitter<any>();
    categoryForm: FormGroup;
    category_array = [];
    
    constructor(private fb: FormBuilder) {

    }

    ngOnInit() {

    }

    ngOnChanges() {
        if (this.categories && this.categories.length > 0) {
            if (this.category_array.length == 0) {
                this.category_array.push(this.categories);
            }
            this.createCateogryForm();
        }
    }

    createCateogryForm() {
        this.categoryForm = this.fb.group({
            categories: this.fb.array([
                this.initCategory()
            ])
        })
    }

    initCategory() {
        return this.fb.group({
            category: [""]
        })
    }

    initChildrenCategory(categories) {
        return this.fb.group({
            category: [categories]
        })
    }

    onAddMoreCategory(category, i) {
        this.sendCategory.emit(category.id);
        this.onDelete(i);
        if (category.length > 0) {
            this.category_array.push(category);
            const control = <FormArray>this.categoryForm.controls['categories'];
            control.push(this.initChildrenCategory(category));
        }

    }

    onDelete(i) {
        let startIndex = i;
        let count = startIndex + 1;
        let delete_count = this.category_array.length - count;
        let delete_index_for_formarray = startIndex + 1;
        let category_control_length = (<FormArray>this.categoryForm.controls['categories']).length;
        // because formarray will update it's index, if we delete control index 1, control index 2 will become index 1;
        for(let j = category_control_length; j >=i + 1;  j--){
            const control = <FormArray>this.categoryForm.controls['categories'];
            control.removeAt(j);
        }
        this.category_array = this.category_array.splice(0, count);
    }
}