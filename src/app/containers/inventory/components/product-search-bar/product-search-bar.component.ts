import { Component, OnInit, OnChanges, Input, HostListener, Output, ElementRef, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, NgForm, ReactiveFormsModule, FormGroupDirective } from "@angular/forms";

@Component({
    selector: 'product-search-bar',
    templateUrl: './product-search-bar.component.html',
    styleUrls: ['./product-search-bar.component.scss']
})
export class ProductSearchBarComponent implements OnInit {
    @Input() defaultOption;
    @Input() options = [];
    @Input() optionPlaceholder;
    @Input() searchPlaceholder;
    searchCtrl: FormControl = new FormControl();
    optionCtrl: FormControl = new FormControl();

    @Output() onSearch = new EventEmitter<any>();

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.listenOptionCtrl();
        this.listenSearchCtrl();
    }

    listenSearchCtrl() {
        this.searchCtrl.valueChanges.subscribe(
            (term) => {
                this.onSearch.emit({ option: this.optionCtrl.value, term: term });
            }
        )
    }

    listenOptionCtrl() {
        this.optionCtrl.valueChanges.subscribe(
            (option) => {
                this.searchCtrl.patchValue("");
                this.searchPlaceholder = 'Search By ' + option;
            }
        )
    }
}
