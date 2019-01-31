import { Component, OnInit, Input } from '@angular/core';


@Component({
    selector : 'product-category-card',
    templateUrl : './category-card.component.html',
    styleUrls : ['./category-card.component.scss', '../product-info.component.scss']
})


export class ProductCategoryCardCompnent implements OnInit{
    @Input() categories;

    constructor(){

    }

    ngOnInit(){

    }
}