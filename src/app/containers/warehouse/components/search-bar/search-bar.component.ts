import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

@Component({
    selector: 'search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})

export class SearchBarComponent implements OnInit {
    searchCtrl: FormControl = new FormControl();
    @Output() sendTerm = new EventEmitter<any>();
    @Input() placeholder: string;
    @Input() products;
    selectable = true;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes = [ENTER, COMMA];
    selectedProduct;

    constructor() {

    }

    ngOnInit() {
        this.searchCtrl.valueChanges.subscribe(
            (term) => {
                this.sendTerm.emit(term);
            }
        )
    }

    add(event: MatChipInputEvent): void {
        setTimeout(e => {
            const input = event.input;
            const value = this.selectedProduct || event.value;
            // Add our product
            // Reset the input value
            if (input) {
                input.value = '';
            }
            this.selectedProduct = '';
        }, 0);
    }

    onSave(personInput) {
        if (this.products.length) {

        }
    }

    remove(product: any): void {
        const index = this.products.indexOf(product);
        if (index >= 0) {
            this.products.splice(index, 1);
        }
    }
}