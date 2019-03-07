import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DialogService } from '../../../../../core/services/dialog.service';
import { InventoryService } from '../../../../../core/services/inventory.service';

@Component({
    selector: 'shop-product-description',
    templateUrl: './product-description.component.html',
    styleUrls: ['./product-description.component.scss']
})

export class ShopProductDescriptionComponent implements OnInit {
    @Input() description: string;
    @Output() sendDes = new EventEmitter<string>();
    desForm: FormGroup;
    editMode : boolean = false;

    constructor(private fb: FormBuilder,
        private dialogService: DialogService) {
    }

    ngOnInit() {
        // if (!this.description) {
        //     this.createForm();
        // }

        this.createForm();
    }

    createForm() {
        this.desForm = this.fb.group({
            description: [this.description]
        })
    }

    onSave() {
        if (!this.desForm.value.description) {
            this.dialogService.openAlertDialog("Please provide description.");
            return;
        }
        if(this.desForm.valid){
            this.sendDes.emit(this.desForm.value);
            this.editMode = false;
        }
    }
}