import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'show-price',
    templateUrl: './show-price.component.html',
    styleUrls: ['./show-price.component.scss']
})

export class ShowPriceComponent implements OnInit {
    @Input() retailPrices;

    constructor() {

    }

    ngOnInit() {

    }
}