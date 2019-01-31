import { Component, Input, EventEmitter, Output} from "@angular/core";

@Component({
    selector:"order-company-card",
    templateUrl:"order-company-card.component.html",
    styleUrls:["order-company-card.component.scss"]
})

export class OrderCompanyCardComponent{
    @Input() url:string;
    @Input() name:string;
    @Input() industry:string;
    @Input() account;
    // @Input() usage :string;
    // @Input() possibility:string;
    // @Input() orderCapacity:string;
    // @Input() type: number;
    @Output() selected = new EventEmitter<any>();
    constructor(){
    
    }

    confirm(){
        this.selected.emit(this.account);
    }    
}