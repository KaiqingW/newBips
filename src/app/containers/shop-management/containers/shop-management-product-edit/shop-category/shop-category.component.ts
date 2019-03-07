import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
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

export class ShopCateogryComponent implements OnInit, OnChanges {
    @Input() categories;
    @Input() productCategories;
    @Input() firstCate;
    @Input() secondCate;
    @Input() thirdCate;
    @Input() unit_weight;
    @Input() product;
    @Output() sendData = new EventEmitter<any>();
    categoryForm: FormGroup;
    units = ['oz', 'lb'];
    days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11','12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    editMode: boolean = false;
    inital: boolean = true;

    constructor(private fb: FormBuilder) {
        this.createCateogryForm();
        this.categoryForm.get('first_category').valueChanges.subscribe(val => {
            this.categoryForm.patchValue({
                second_category: "",
                third_category: ""
            });
        });
        this.categoryForm.get('second_category').valueChanges.subscribe(val => {
            this.categoryForm.patchValue({
                third_category: ""
            });
        });
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.unit_weight && this.categoryForm && this.product) {
            let weight_and_unit = this.unit_weight.split(" ");
            this.categoryForm.patchValue({
                unit_weight: weight_and_unit[0],
                unit: weight_and_unit[1],
                color: this.product.color,
                size: this.product.size,
                msrp: this.product.msrp / 100,
                shipping_time: this.product.shipping_time,
                sku: this.product.sku,
            })
        }
        if (this.firstCate && this.inital) {
            let firstCategory, secondCategory, thirdCategory;
            firstCategory = this.getCategory(this.categories, this.firstCate);
            this.categoryForm.patchValue({
                first_category: firstCategory,
                second_category: "",
                third_category: ""
            })
            if (this.secondCate) {
                secondCategory = this.getCategory(firstCategory.children, this.secondCate);
                this.categoryForm.patchValue({
                    second_category: secondCategory,
                    third_category: ""
                })
            }
            if (this.thirdCate) {
                thirdCategory = this.getCategory(secondCategory.children, this.thirdCate);
                this.categoryForm.patchValue({
                    third_category: thirdCategory
                })
            }
            this.inital = false;
        }
    }

    getCategory(categories, cateString) {
        let res = "";
        categories.forEach(category => {
            if (category.name == cateString) {
                res = category;
            }
        })
        return res;
    }

    createCateogryForm() {
        this.categoryForm = this.fb.group({
            unit_weight: [''],
            unit: [''],
            first_category: [''],
            second_category: [''],
            third_category: [''],
            color: [''],
            size: [''],
            msrp: [''],
            brand: [''],
            shipping_time: [''],
            sku: ['']
        })
    }

    onSave() {
        if (this.categoryForm.valid) {
            this.categoryForm.value.msrp = this.categoryForm.value.msrp * 100;
            let obj = this.categoryForm.value;
            for (var prop in obj) {
                if (obj[prop] && (prop == 'first_category' || prop == 'second_category' || prop == 'third_category')) {
                    obj[prop] = obj[prop].name;
                }
                if (prop == 'unit_weight') {
                    obj[prop] = obj['unit_weight'] + ' ' + obj['unit'];
                }
            }
            this.sendData.emit(obj);
            this.editMode = false;
        }
    }

}
