import { Component, Input } from "@angular/core";

@Component ({
    selector:"product-modal",
    templateUrl:"product-modal.component.html",
    styleUrls:['product-modal.component.scss']
})

export class ProductModalComponent{
    @Input() Url;
    @Input() Name;

}