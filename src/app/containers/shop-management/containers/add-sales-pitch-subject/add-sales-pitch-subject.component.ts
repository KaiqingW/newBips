import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { InventoryService } from 'app/core/services/inventory.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'add-sales-pitch-subject',
    templateUrl: './add-sales-pitch-subject.component.html',
    styleUrls: ['./add-sales-pitch-subject.component.scss']
})

export class AddSalesPitchSubjectComponent implements OnInit, OnDestroy {
    @Output() sendSalesPitchForm = new EventEmitter<any>();
    pitch_subject_names: string[] = ['Remark', 'Function', 'Package Content'];
    pitchSubjectForm: FormGroup;
    isLoading: boolean = false;
    company_id: number;
    product_id: number;
    product;

    constructor(private fb: FormBuilder,
        private inventoryService: InventoryService,
        private location: Location,
        private route: ActivatedRoute,
    ) {
        this.product_id = +this.route.snapshot.paramMap.get('pid');
        this.company_id = +this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit() {
        this.createSalePitchSubject();
        this.getProductDetail();
        setTimeout(() => {
            const buttonClick = document.getElementById("header-submit-edit");
            buttonClick.addEventListener("click", ($event) => {
                this.onSave();
            });
        }, 0);
    }

    ngOnDestroy(){
    }

    getProductDetail() {
        this.isLoading = true;
        this.inventoryService.getProductInfo(this.company_id, this.product_id).subscribe(
            (res) => {
                this.isLoading = false;
                this.product = res;
            },
            (err) => {
            },
            () => {

            }
        )
    }

    onGetImg(event) {
        (<FormArray>this.pitchSubjectForm.controls['sales_pitches']).at(event.index).patchValue(
            {
                image_id: event.image_id
            }
        )
    }

    createSalePitchSubject() {
        this.pitchSubjectForm = this.fb.group({
            pitch_subject_name: [''],
            sales_pitches: this.fb.array([
                this.initSalePitch()
            ])
        })
    }

    initSalePitch() {
        return this.fb.group({
            body: ['', Validators.required],
            image_id: ['']
        });
    }

    get salesPitchForm() {
        return this.pitchSubjectForm.get('sales_pitches') as FormArray
    }

    logChange(event) {
        (<FormArray>this.pitchSubjectForm.controls['sales_pitches']).at(event.index).patchValue(
            {
                body: event.richTxt
            }
        )
    }

    onAddMore() {
        const control = <FormArray>this.pitchSubjectForm.controls['sales_pitches'];
        control.push(this.initSalePitch());
    }

    openModal() {

    }

    closeModal() {

    }

    onDelete(i) {
        if (this.pitchSubjectForm.controls.sales_pitches['controls'].length > 1) {
            const control = <FormArray>this.pitchSubjectForm.controls['sales_pitches'];
            control.removeAt(i);
        }
    }

    onSave() {
        if (this.pitchSubjectForm.valid) {
            this.inventoryService.addShopSalesSubject(this.company_id, this.product_id, this.pitchSubjectForm.value).subscribe(
                res => {
                    this.location.back();
                },
                (err) => {

                },
                () => {
                    this.isLoading = false;
                }
            )
        } else {
            alert("The Data is not valid, text is required in each sales pitch!")
        }
    }


    onGetSalesPitch(value) {
        this.isLoading = true;
    }



}