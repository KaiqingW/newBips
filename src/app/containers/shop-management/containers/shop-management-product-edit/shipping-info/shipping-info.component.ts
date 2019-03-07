import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    Validators,
    FormArray,
    ReactiveFormsModule
} from "@angular/forms";
import { DialogService } from '../../../../../core/services/dialog.service';

@Component({
    selector: 'shipping-info',
    templateUrl: './shipping-info.component.html',
    styleUrls: ["./shipping-info.component.scss"]
})

export class ShippingInfoComponent implements OnInit {
    shippingForm: FormGroup;
    @Input() shipping_info;
    @Output() sendShippingInfo = new EventEmitter<any>();

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {

    }

    changeShipping(value) {
        let obj = {};
        obj["free_shipping"] = value;
        this.sendShippingInfo.emit(obj);
    }
}