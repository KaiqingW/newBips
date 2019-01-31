import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
    selector: 'app_warehouse',
    templateUrl: 'warehouse.component.html',
    styleUrls: ['warehouse.component.scss']
})

export class WarehouseComponent implements OnInit{
    constructor(
         private route: ActivatedRoute,
        private router: Router
    ){}
    


    ngOnInit(){}
}