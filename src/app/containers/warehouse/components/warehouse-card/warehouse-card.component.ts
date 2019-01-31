import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector : 'warehouse-card',
    templateUrl : './warehouse-card.component.html',
    styleUrls : ['./warehouse-card.component.scss']
})

export class WarehouseCardComponent implements OnInit{
    @Input() warehouse;
     
    constructor(){}

    ngOnInit(){

    }
}