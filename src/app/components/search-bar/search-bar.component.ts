import { Component, OnInit, OnChanges, Input, HostListener, Output, ElementRef, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, NgForm, ReactiveFormsModule, FormGroupDirective } from "@angular/forms";

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
    @Output() onSearch = new EventEmitter<any>();
    @Input() placeholder;
    @Input() products;
    @Output() onSendSelectProduct = new EventEmitter<any>();

    searchCtrl: FormControl;
    
    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.searchCtrl = new FormControl();
        this.searchCtrl.valueChanges.subscribe(
          (term) => {
            this.onSearch.emit(term);
          }
        )
    }
    
    productSelect(product){
        this.onSendSelectProduct.emit(product);
    }
    
}
