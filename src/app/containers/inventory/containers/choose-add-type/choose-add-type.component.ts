import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';

@Component({
    selector: 'app-choose-add-type',
    templateUrl: './choose-add-type.component.html',
    styleUrls: ['./choose-add-type.component.scss']
})


export class ChooseAddTypeCompoent implements OnInit {

    // for opportunity, editted by yali    
    crmOpportunityProjectId;

    links = [
        {
            name: 'Add Product',
            url: '../addProduct'
        },
        {
            name: 'Add Service',
            url: '../addService'
        }
    ];

    constructor(
        private route: ActivatedRoute,
        
    ) {
        // for opportunity, editted by yali    
        this.crmOpportunityProjectId = this.route.snapshot.queryParams['crmOpportunityProjectId'];
    }

    ngOnInit() {

    }

    choose(type) {

    }
}