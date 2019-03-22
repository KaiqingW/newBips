import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
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
    selector: "app-list-product-card",
    templateUrl: "./list-product-card.component.html",
    styleUrls: ["./list-product-card.component.scss"]
})


export class ListProductCardComponent implements OnInit, OnChanges {
    @Input() productList;
    @Output() sendNav = new EventEmitter<any>();
    @Output() sendNavToEdit = new EventEmitter<any>();
    @Input() selects;
    @Input() placeholder;
    @Input() default;
    @Output() sendSelect = new EventEmitter<any>();
    selectedProduct;
    selectedWarehouse;
    buttonTxt = '';
    @Output() sendScroll = new EventEmitter<any>();
    isOpenDetail: boolean;
    // @Output() opened;

    constructor() { }

    ngOnInit() {

    }

    onGetSelect(selectData, product_id){
        this.sendSelect.emit({data : selectData, product_id : product_id});
    }
    
    ngOnChanges(){
        // if(this.product.shop_status == 2){

        // }
    }
    selectProduct(product) {
    }

    onNavToDetail(event, id) {
        event.stopPropagation();
        this.sendNav.emit(id);
        this.isOpenDetail = !this.isOpenDetail;
        // this.opened.emit(this.isOpenDetail);
    }
    openAddTransDialog(id) {

    }

    toSendScroll($event){
        this.sendScroll.emit($event);
    }

    onEdit(product) {

    }

    onNavToEdit(id) {
        this.sendNavToEdit.emit(id);
        
    }
}