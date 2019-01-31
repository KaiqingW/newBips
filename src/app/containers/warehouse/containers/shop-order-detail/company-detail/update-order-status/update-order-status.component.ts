import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
    selector: 'app-shop-order-update-status',
    templateUrl: './update-order-status.component.html',
    styleUrls: ['./update-order-status.component.scss']
})


export class UpdateOrderStatusComponent implements OnInit, OnChanges {
    @Input() warehouse;
    @Output() sentSelect = new EventEmitter<any>();
    selects = ["Preparing", "Shipping", "Received"];
    default = "Preparing";
    placeholder = "Shipping Status";

    constructor() { }

    ngOnInit() {

    }
    
    ngOnChanges() {
        if(this.warehouse.status == 0){
            this.default = 'Preparing';
        } else if (this.warehouse.status === 1){
            this.default = 'Shipping';
        } else if (this.warehouse.status == 2){
            this.default = 'Received';
        }
    }
    
    onGetSelect(obj) {
        console.log(obj);

        if (obj.status === 'Shipping') {
            // this.
            obj.status = 1;
        } else if (obj.status == 'Received') {
            obj.status = 2;
        } else {
            obj.status = 0;
        }

        this.sentSelect.emit(obj);
    }
}