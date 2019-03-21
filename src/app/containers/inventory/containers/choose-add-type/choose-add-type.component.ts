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
    isAddProduct;
    isAddService;


    links = [
        {
            name: 'Add Product',
            url: '../product/addProduct',
            type: 'product',
        },
        {
            name: 'Add Service',
            url: '../product/addService',
            type: 'service',
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
    addItem(link) {
        console.log(link.type);
        if (link.type == "product") {
            this.isAddProduct = true;
        } else if (link.type == 'service') {
            this.isAddService = true;
        }
    }
}