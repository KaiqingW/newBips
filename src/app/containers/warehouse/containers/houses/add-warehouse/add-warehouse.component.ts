
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { WarehouseService } from 'app/core/services/warehouse.service';
import { Warehouse } from 'app/core/models/warehouse';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import 'rxjs/add/operator/catch';
import { UpsService } from '../../../../../core/services/ups.service';
import { DialogService } from '../../../../../core/services/dialog.service';
import { ZipCodeService } from '../../../../../core/services/zipcode.service';

@Component({
    selector: 'app-add-warehouse',
    templateUrl: 'add-warehouse.component.html',
    styleUrls: ['add-warehouse.component.scss']
})

export class AddWarehouseComponent implements OnInit {
    company_id: number;
    warehouse: Warehouse;
    warehouseForm: FormGroup;
    latitude: number;
    longitude: number;
    zipcodeError = false;
    isLoading: boolean = false;
    business_time = [
        // "    6:00    "    ,
        // "    6:15    "    ,
        // "    6:30    "    ,
        // "    6:45    "    ,
        // "    7:00    "    ,
        // "    7:15    "    ,
        // "    7:30    "    ,
        // "    7:45    "    ,
        "    8:00    ",
        "    8:15    ",
        "    8:30    ",
        "    8:45    ",
        "    9:00    ",
        "    9:15    ",
        "    9:30    ",
        "    9:45    ",
        "    10:00    ",
        "    10:15    ",
        "    10:30    ",
        "    10:45    ",
        "    11:00    ",
        "    11:15    ",
        "    11:30    ",
        "    11:45    ",
        "    12:00    ",
        "    12:15    ",
        "    12:30    ",
        "    12:45    ",
        "    13:00    ",
        "    13:15    ",
        "    13:30    ",
        "    13:45    ",
        "    14:00    ",
        "    14:15    ",
        "    14:30    ",
        "    14:45    ",
        "    15:00    ",
        "    15:15    ",
        "    15:30    ",
        "    15:45    ",
        "    16:00    ",
        "    16:15    ",
        "    16:30    ",
        "    16:45    ",
        "    17:00    ",
        "    17:15    ",
        "    17:30    ",
        "    17:45    ",
        "    18:00    ",
        "    18:15    ",
        "    18:30    ",
        "    18:45    ",
        "    19:00    ",
        "    19:15    ",
        "    19:30    ",
        "    19:45    ",
        "    20:00    ",
        "    20:15    ",
        "    20:30    ",
        "    20:45    ",
        "    21:00    ",
        // "    21:15    "    ,
        // "    21:30    "    ,
        // "    21:45    "    ,
        // "    22:00    "    ,
        // "    22:15    "    ,
        // "    22:30    "    ,
        // "    22:45    "    ,
        // "    23:00    "    ,
        // "    23:15    "    ,
        // "    23:30    "    ,
        // "    23:45    "    ,
        // "    0:00    "    ,
        // "    0:15    "    ,
        // "    0:30    "    ,
        // "    6:00    "    ,
        // "    6:15    "    ,
        // "    6:30    "    ,
        // "    6:45    "    ,
        // "    7:00    "    ,
        // "    7:15    "    ,
        // "    7:30    "    ,
        // "    7:45    "    ,
        // "    8:00    "    ,
        // "    8:15    "    ,
        // "    8:30    "    ,
        // "    8:45    "    ,
    ];
    countries = [];
    fullAddress: boolean = false;
    northAmerica: boolean = false;
    selecteCountryCtrl = new FormControl();
    zipcodeCtrl = new FormControl();
    showFullInputAddress: boolean = false;
    state: string;
    zipcode;
    city: string;
    country: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private warehouseService: WarehouseService,
        private fb: FormBuilder,
        private upsService: UpsService,
        private location: Location,
        private dialogService: DialogService,
        private zipCodeService: ZipCodeService
    ) {
        this.company_id = + this.route.snapshot.paramMap.get('cid');
        this.createWarehouseForm();
        this.countries = this.upsService.getUpsCountries();

        this.selecteCountryCtrl.valueChanges.subscribe(
            (res) => {
                this.warehouseForm.patchValue({
                    address: {
                        country: res
                    }
                });
                if (res == "US" || res == "CA") {
                    this.northAmerica = true;

                } else {
                    this.fullAddress = true;
                }
            }
        )

        this.zipcodeCtrl.valueChanges.subscribe(
            (term) => {
                this.onSearch(term);
            }
        )
    }

    ngOnInit() {
        setTimeout(() => {
            const buttonClick = document.getElementById("header-submit-edit");
            buttonClick.addEventListener("click", () => {
                this.onSave();
            });
        }, 0);
    }

    onSearch(value) {
        if (value.length >= 5) {
            this.zipCodeService.getZipCodeAddress(value).subscribe(
                res => {
                    console.log(res);
                    if (res.results.length > 0) {
                        const formatt = res.results[0].formatted_address.split(', ');
                        const stetaAndZipcode = formatt[1].split(' ');
                        // console.log(res.results);
                        // console.log(formatt);
                        this.state = stetaAndZipcode[0];
                        this.zipcode = stetaAndZipcode[1];
                        this.city = formatt[0];
                        this.country = formatt[2];
                        console.log(this.country);
                        this.warehouseForm.patchValue({
                            address: {
                                // country: ["", [Validators.required]],
                                state: stetaAndZipcode[0],
                                city: formatt[0],
                                zipcode: stetaAndZipcode[1],
                                // latitude: [""],
                                // longitude: [""]
                            }
                        });
                        this.fullAddress = true;

                        console.log(this.warehouseForm.value);
                        // this.zipcodeError = false;
                        // this.allFieldRequied = false;
                    } else {
                        // console.log("err");
                        this.zipcodeError = true;
                        // this.allFieldRequied = false;
                    }
                },
                err => {
                    console.log(err);
                }
            )
        }

    }

    createWarehouseForm() {
        this.warehouseForm = this.fb.group({
            name: [''],
            address: this.fb.group({
                country: ["", [Validators.required]],
                state: [""],
                city: [""],
                street1: [""],
                street2: [""],
                zipcode: [""],
                latitude: [""],
                longitude: [""]
            }),
            open_time: [""],
            close_time: [""],
            alt_phone_number: [""],
            fax: [""],
            email: [""],
            contact_name: [""],
            phone_number: [""],
            description: [""],
            capacity: [""]
        })
    }

    // onAddWarehouse(){
    //     this.warehouseService.addOneWarehouse(this.company_id, this.warehouse).subscribe(
    //         (res) => {
    //             console.log(res);
    //         },
    //         (err) => {
    //             console.log(err);
    //         }
    //     )
    // }

    getWarehouseErrorMessage() {
        return this.warehouseForm.controls.name.hasError('required') ? 'You must enter a value' :
            this.warehouseForm.controls.name.hasError('maxlength') ? 'Should be at most 20 characters' :
                '';
    }

    getUnfoundZipcodeErrorMessage() {
        return this.warehouseForm.controls.address.hasError('required') ? 'You must enter a value' :
            this.warehouseForm.controls.address.hasError('unfoundZip') ? `Zipcode is not valid!` : '';
    }

    onSave() {
        if (!this.warehouseForm.value.address.country) {
            this.dialogService.openAlertDialog('Please select a country.');
        }
        if (this.warehouseForm.valid) {
            this.isLoading = true;
            this.warehouseService.addOneWarehouse(this.company_id, this.warehouseForm.value).subscribe(
                (res) => {
                    this.isLoading = false;
                    this.location.back();
                },
                (err) => {
                    this.isLoading = false;
                    this.warehouseForm.controls.address.setErrors({ 'unfoundZip': true });
                }
            )
        }
    }
}
